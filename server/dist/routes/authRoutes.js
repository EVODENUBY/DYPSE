"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_js_1 = require("../controllers/authController.js");
const router = express_1.default.Router();
// Public routes
router.post('/register', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], authController_js_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
    (0, express_validator_1.body)('password').exists().withMessage('Password is required'),
], authController_js_1.login);
// Password reset routes
router.post('/request-password-reset', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please include a valid email'),
], authController_js_1.requestPasswordReset);
router.post('/reset-password', [
    (0, express_validator_1.body)('token').notEmpty().withMessage('Reset token is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
], authController_js_1.resetPassword);
// Protected routes
router.get('/me', authController_js_1.protect, authController_js_1.getMe);
// Admin routes
// router.get('/users', protect, authorize('admin'), getAllUsers);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map