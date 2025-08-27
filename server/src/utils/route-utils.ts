import { Request, Response, RequestHandler, Application, RequestHandler as ExpressRequestHandler } from 'express';

type Route = {
  path: string;
  methods: string[];
};

type ExpressLayer = {
  route?: {
    path: string;
    methods: { [method: string]: boolean };
    stack: ExpressLayer[];
  };
  name: string;
  handle: {
    stack?: ExpressLayer[];
  };
  regexp: RegExp;
  keys: any[];
};

export function getRoutes(app: Application): Route[] {
  const routes: Route[] = [];

  const processMiddleware = (stack: ExpressLayer | ExpressLayer[] | undefined, basePath = '') => {
    if (!stack) return;

    if (Array.isArray(stack)) {
      stack.forEach((item) => processMiddleware(item, basePath));
      return;
    }

    if (typeof stack !== 'object') return;

    // Handle route middleware
    if (stack.name === 'router' || stack.name === 'bound dispatch') {
      const router = stack.handle;
      if (router && router.stack) {
        router.stack.forEach((layer: ExpressLayer) => {
          if (layer.route) {
            // Regular route
            const route = layer.route;
            routes.push({
              path: basePath + route.path,
              methods: Object.keys(route.methods).filter(method => 
                method !== '_all' && route.methods[method]
              )
            });
          } else if (layer.name === 'router' || layer.name === 'bound dispatch') {
            // Nested router
            const router = layer.handle;
            if (router?.stack) {
              let path = basePath;
              // Extract the path from the regexp
              const match = layer.regexp.toString().match(/\/?(.*?)(?=\?|\/|$)/);
              if (match?.[1] && match[1] !== '') {
                path += (path.endsWith('/') ? '' : '/') + match[1];
              }
              processMiddleware(router.stack, path);
            }
          }
        });
      }
    }
  };

  // Accessing the router stack
  const mainRouter = (app as any)._router?.stack || [];
  processMiddleware(mainRouter);

  return routes;
}

export function listRoutes(req: Request, res: Response): void {
  const routes = getRoutes(req.app);
  res.json(routes);
};
