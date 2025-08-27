import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { sub: string }; // Adjust this type according to your JWT payload structure
    }
  }
}
