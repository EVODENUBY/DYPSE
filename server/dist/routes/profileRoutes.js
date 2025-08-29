import express from 'express';
import { body, param, query } from 'express-validator';
import { protect } from '../controllers/authController';
import { uploadProfilePicture, uploadCV, handleUploadError } from '../middleware/upload.middleware';
import { enhancedProfileValidation, enhancedExperienceValidation, enhancedEducationValidation, handleValidationErrors } from '../utils/profileValidation';
import { getMyProfile, updateMyProfile, uploadProfilePicture as uploadProfilePictureHandler, uploadCV as uploadCVHandler, getMySkills, searchSkills, createSkill, upsertSkill, deleteSkill, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, getProfileInsights, getProfileAnalytics } from '../controllers/profileController';
const router = express.Router();
// Profile validation schemas
const updateProfileValidation = [
    body('firstName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('First name must be 1-50 characters'),
    body('lastName').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Last name must be 1-50 characters'),
    body('phoneNumber').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
    body('address').optional().trim().isLength({ max: 200 }).withMessage('Address must be less than 200 characters'),
    body('city').optional().trim().isLength({ max: 50 }).withMessage('City must be less than 50 characters'),
    body('country').optional().trim().isLength({ max: 50 }).withMessage('Country must be less than 50 characters'),
    body('postalCode').optional().trim().isLength({ max: 20 }).withMessage('Postal code must be less than 20 characters'),
    body('district').optional().trim().isLength({ max: 50 }).withMessage('District must be less than 50 characters'),
    body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio must be less than 1000 characters'),
    body('jobStatus').optional().isIn(['unemployed', 'employed', 'self_employed']).withMessage('Invalid job status')
];
const skillValidation = [
    body('skillId').notEmpty().isMongoId().withMessage('Valid skill ID is required'),
    body('level').isIn(['beginner', 'intermediate', 'expert']).withMessage('Level must be beginner, intermediate, or expert')
];
const createSkillValidation = [
    body('name').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Skill name is required and must be 1-100 characters'),
    body('category').notEmpty().trim().isLength({ min: 1, max: 50 }).withMessage('Category is required and must be 1-50 characters'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];
const experienceValidation = [
    body('role').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Role is required and must be 1-100 characters'),
    body('employerName').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Employer name is required and must be 1-100 characters'),
    body('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    body('isCurrent').optional().isBoolean().withMessage('isCurrent must be a boolean'),
    body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
];
const educationValidation = [
    body('school').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('School is required and must be 1-100 characters'),
    body('degree').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Degree is required and must be 1-100 characters'),
    body('fieldOfStudy').notEmpty().trim().isLength({ min: 1, max: 100 }).withMessage('Field of study is required and must be 1-100 characters'),
    body('startDate').notEmpty().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date')
];
// Apply authentication to all profile routes
router.use(protect);
// Profile routes
router.get('/me', getMyProfile);
router.put('/me', enhancedProfileValidation, handleValidationErrors, updateMyProfile);
// File upload routes
router.post('/upload/profile-picture', uploadProfilePicture.single('profilePicture'), handleUploadError, uploadProfilePictureHandler);
router.post('/upload/cv', uploadCV.single('cv'), handleUploadError, uploadCVHandler);
// Skills routes
router.get('/skills/me', getMySkills);
router.get('/skills/search', query('q').notEmpty().trim().isLength({ min: 1, max: 50 }).withMessage('Search query is required'), searchSkills);
router.post('/skills/create', createSkillValidation, handleValidationErrors, createSkill);
router.post('/skills', skillValidation, upsertSkill);
router.delete('/skills/:skillId', param('skillId').isMongoId().withMessage('Valid skill ID is required'), deleteSkill);
// Experience routes
router.post('/experience', enhancedExperienceValidation, handleValidationErrors, addExperience);
router.put('/experience/:experienceId', param('experienceId').isMongoId().withMessage('Valid experience ID is required'), enhancedExperienceValidation, handleValidationErrors, updateExperience);
router.delete('/experience/:experienceId', param('experienceId').isMongoId().withMessage('Valid experience ID is required'), deleteExperience);
// Education routes
router.post('/education', enhancedEducationValidation, handleValidationErrors, addEducation);
router.put('/education/:educationId', param('educationId').isMongoId().withMessage('Valid education ID is required'), enhancedEducationValidation, handleValidationErrors, updateEducation);
router.delete('/education/:educationId', param('educationId').isMongoId().withMessage('Valid education ID is required'), deleteEducation);
// Analytics and Insights routes
router.get('/insights', getProfileInsights);
router.get('/analytics', getProfileAnalytics);
export default router;
//# sourceMappingURL=profileRoutes.js.map