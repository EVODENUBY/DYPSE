"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const upload_middleware_1 = require("../middleware/upload.middleware");
const profileValidation_1 = require("../utils/profileValidation");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
// Profile validation schemas
const updateProfileValidation = [
    (0, express_validator_1.body)('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
    (0, express_validator_1.body)('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
    (0, express_validator_1.body)('phoneNumber').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
    (0, express_validator_1.body)('address').optional().trim().isLength({ max: 200 }).withMessage('Address must be less than 200 characters'),
    (0, express_validator_1.body)('city').optional().trim().isLength({ max: 50 }).withMessage('City must be less than 50 characters'),
    (0, express_validator_1.body)('country').optional().trim().isLength({ max: 50 }).withMessage('Country must be less than 50 characters'),
    (0, express_validator_1.body)('postalCode').optional().trim().isLength({ max: 20 }).withMessage('Postal code must be less than 20 characters'),
    (0, express_validator_1.body)('district').optional().trim().isLength({ max: 50 }).withMessage('District must be less than 50 characters'),
    (0, express_validator_1.body)('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio must be less than 1000 characters'),
    (0, express_validator_1.body)('jobStatus').optional().isIn(['unemployed', 'employed', 'self_employed']).withMessage('Invalid job status')
];
const skillValidation = [
    (0, express_validator_1.body)('skillId').notEmpty().isMongoId().withMessage('Valid skill ID is required'),
    (0, express_validator_1.body)('level').isIn(['beginner', 'intermediate', 'expert']).withMessage('Level must be beginner, intermediate, or expert')
];
const createSkillValidation = [
    (0, express_validator_1.body)('name').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Skill name is required and must be 1-100 characters'),
    (0, express_validator_1.body)('category').notEmpty().trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be 1-50 characters'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];
const experienceValidation = [
    (0, express_validator_1.body)('role').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Role is required and must be 1-100 characters'),
    (0, express_validator_1.body)('employerName').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Employer name is required and must be 1-100 characters'),
    (0, express_validator_1.body)('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    (0, express_validator_1.body)('isCurrent').optional().isBoolean().withMessage('isCurrent must be a boolean'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
];
const educationValidation = [
    (0, express_validator_1.body)('school').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('School is required and must be 1-100 characters'),
    (0, express_validator_1.body)('degree').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Degree is required and must be 1-100 characters'),
    (0, express_validator_1.body)('fieldOfStudy').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Field of study is required and must be 1-100 characters'),
    (0, express_validator_1.body)('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().withMessage('End date must be a valid date')
];
// Apply authentication to all profile routes
router.use(authController_1.protect);
// Profile routes
router.get('/me', profileController_1.getMyProfile);
router.put('/me', profileValidation_1.enhancedProfileValidation, profileValidation_1.handleValidationErrors, profileController_1.updateMyProfile);
// File upload routes
router.post('/upload/profile-picture', upload_middleware_1.uploadProfilePicture.single('profilePicture'), upload_middleware_1.handleUploadError, profileController_1.uploadProfilePicture);
router.post('/upload/cv', upload_middleware_1.uploadCV.single('cv'), upload_middleware_1.handleUploadError, profileController_1.uploadCV);
// Skills routes
router.get('/skills/me', profileController_1.getMySkills);
router.get('/skills/search', (0, express_validator_1.query)('q').notEmpty().trim().isLength({ min: 1, max: 50 }).withMessage('Search query is required'), profileController_1.searchSkills);
router.post('/skills/create', createSkillValidation, profileValidation_1.handleValidationErrors, profileController_1.createSkill);
router.post('/skills', skillValidation, profileController_1.upsertSkill);
router.delete('/skills/:skillId', (0, express_validator_1.param)('skillId').isMongoId().withMessage('Valid skill ID is required'), profileController_1.deleteSkill);
// Experience routes
router.post('/experience', profileValidation_1.enhancedExperienceValidation, profileValidation_1.handleValidationErrors, profileController_1.addExperience);
router.put('/experience/:experienceId', (0, express_validator_1.param)('experienceId').isMongoId().withMessage('Valid experience ID is required'), profileValidation_1.enhancedExperienceValidation, profileValidation_1.handleValidationErrors, profileController_1.updateExperience);
router.delete('/experience/:experienceId', (0, express_validator_1.param)('experienceId').isMongoId().withMessage('Valid experience ID is required'), profileController_1.deleteExperience);
// Education routes
router.post('/education', profileValidation_1.enhancedEducationValidation, profileValidation_1.handleValidationErrors, profileController_1.addEducation);
router.put('/education/:educationId', (0, express_validator_1.param)('educationId').isMongoId().withMessage('Valid education ID is required'), profileValidation_1.enhancedEducationValidation, profileValidation_1.handleValidationErrors, profileController_1.updateEducation);
router.delete('/education/:educationId', (0, express_validator_1.param)('educationId').isMongoId().withMessage('Valid education ID is required'), profileController_1.deleteEducation);
// Analytics and Insights routes
router.get('/insights', profileController_1.getProfileInsights);
router.get('/analytics', profileController_1.getProfileAnalytics);
exports.default = router;
//# sourceMappingURL=profileRoutes.js.map