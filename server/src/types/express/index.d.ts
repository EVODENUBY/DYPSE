import { AuthUser } from '../../middlewares/auth';

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

// Re-export all types from @types/express
export * from 'express';
export { default } from 'express';
