"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_model_1 = require("../models/user.model");
const youthProfileController_1 = require("../controllers/admin/youthProfileController");
const router = express_1.default.Router();
// Protect all routes with authentication and admin authorization
router.use(auth_middleware_1.authenticateToken);
router.use((0, auth_middleware_1.authorize)(user_model_1.UserRole.ADMIN));
// Youth profiles management
router.get('/youth-profiles', youthProfileController_1.getAllYouths);
router.patch('/youth-profiles/:id/verify', youthProfileController_1.updateVerificationStatus);
router.delete('/youth-profiles/:id', youthProfileController_1.deleteYouthProfile);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map