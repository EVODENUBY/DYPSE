import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthUser {
  userId: string;
  role: 'youth' | 'employer' | 'admin' ;
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = header.replace('Bearer ', '').trim();
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    req.auth = { userId: decoded.sub as string, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(roles: AuthUser['role'][]): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}


