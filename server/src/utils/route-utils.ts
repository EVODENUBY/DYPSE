import { Request, Response, RequestHandler } from 'express';
import { Application } from 'express-serve-static-core';

type Route = {
  path: string;
  methods: string[];
};

export function getRoutes(app: Application): Route[] {
  const routes: Route[] = [];

  const processMiddleware = (stack: any, basePath = '') => {
    if (!stack) return;

    if (Array.isArray(stack)) {
      stack.forEach((item) => processMiddleware(item, basePath));
      return;
    }

    if (typeof stack !== 'function') return;

    // Handle route middleware
    if (stack.name === 'router' || stack.name === 'bound dispatch') {
      const router = stack.handle;
      if (router && router.stack) {
        router.stack.forEach((layer: any) => {
          if (layer.route) {
            // Regular route
            const route = layer.route;
            routes.push({
              path: basePath + route.path,
              methods: Object.keys(route.methods).filter(method => route.methods[method])
            });
          } else if (layer.name === 'router' || layer.name === 'bound dispatch') {
            // Nested router
            const routerPath = layer.regexp.toString()
              .replace('/^\\/', '')
              .replace('\\/?(?=\\/|$)/i', '')
              .replace(/\\\//g, '/');
            
            if (layer.handle && layer.handle.stack) {
              processMiddleware(layer.handle.stack, basePath + (routerPath === '(?:^\\/|$)' ? '' : `/${routerPath}`));
            }
          }
        });
      }
    }
  };

  // Process the main app's middleware stack
  processMiddleware(app._router.stack);

  return routes;
}

export const listRoutes: RequestHandler = (req: Request, res: Response) => {
  const routes = getRoutes(req.app);
  res.json(routes);
};
