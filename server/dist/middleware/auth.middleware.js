import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';
export const authenticateToken = async (req, res, next) => {
    try {
        let token;
        // Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7); // Remove 'Bearer ' prefix
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is missing or invalid'
            });
        }
        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            // Check if user still exists
            const user = await User.findById(decoded.id).exec();
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }
            // Check if user is active (allow unverified users for now)
            // TODO: Implement proper email verification flow
            // if (!user.isVerified) {
            //   return res.status(401).json({ 
            //     success: false, 
            //     message: 'User account is not verified' 
            //   });
            // }
            // Attach user to request object
            req.user = {
                id: decoded.id,
                role: decoded.role
            };
            next();
        }
        catch (jwtError) {
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired'
                });
            }
            else if (jwtError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            else {
                throw jwtError;
            }
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};
// Middleware to check for specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No user authenticated'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions'
            });
        }
        next();
    };
};
// Middleware to check if user is a youth
export const requireYouth = authorize(UserRole.YOUTH);
// Middleware to check if user is an employer
export const requireEmployer = authorize(UserRole.EMPLOYER);
// Middleware to check if user is an admin
export const requireAdmin = authorize(UserRole.ADMIN);
//# sourceMappingURL=auth.middleware.js.map