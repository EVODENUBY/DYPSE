import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, protect, requestPasswordReset, resetPassword } from '../controllers/authController.js';
const router = express.Router();
// Public routes
router.post('/register', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], register);
router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
], login);
// Password reset routes
router.post('/request-password-reset', [
    body('email').isEmail().withMessage('Please include a valid email'),
], requestPasswordReset);
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], resetPassword);
// Protected routes
router.get('/me', protect, getMe);
// Admin routes
// router.get('/users', protect, authorize('admin'), getAllUsers);
export default router;
//# sourceMappingURL=authRoutes.js.map