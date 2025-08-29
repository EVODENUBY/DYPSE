"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileUpdateLimiter = exports.handleValidationErrors = exports.enhancedEducationValidation = exports.enhancedExperienceValidation = exports.enhancedProfileValidation = exports.sanitizeUrl = exports.sanitizePhoneNumber = exports.sanitizeBio = exports.sanitizeTextInput = exports.validateEducationDates = exports.validateExperienceDates = exports.validateDateOfBirth = exports.validatePhoneNumber = void 0;
const express_validator_1 = require("express-validator");
const xss_1 = __importDefault(require("xss"));
const validator_1 = __importDefault(require("validator"));
// XSS Configuration for content sanitization
const xssOptions = {
    whiteList: {
        // Allow basic formatting for bio and descriptions
        'b': [],
        'i': [],
        'em': [],
        'strong': [],
        'br': [],
        'p': [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
};
// Custom validation functions
const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid length (7-15 digits)
    if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        return false;
    }
    // Additional country-specific validation can be added here
    return validator_1.default.isMobilePhone(phone, 'any', { strictMode: false });
};
exports.validatePhoneNumber = validatePhoneNumber;
const validateDateOfBirth = (dateString) => {
    if (!validator_1.default.isISO8601(dateString)) {
        return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD.' };
    }
    const date = new Date(dateString);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    const maxDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
    if (date > now) {
        return { valid: false, error: 'Date of birth cannot be in the future.' };
    }
    if (date < minDate) {
        return { valid: false, error: 'Date of birth cannot be more than 100 years ago.' };
    }
    if (date > maxDate) {
        return { valid: false, error: 'You must be at least 13 years old.' };
    }
    return { valid: true };
};
exports.validateDateOfBirth = validateDateOfBirth;
const validateExperienceDates = (startDate, endDate, isCurrent) => {
    if (!validator_1.default.isISO8601(startDate)) {
        return { valid: false, error: 'Invalid start date format.' };
    }
    const start = new Date(startDate);
    const now = new Date();
    if (start > now) {
        return { valid: false, error: 'Start date cannot be in the future.' };
    }
    // Check if start date is reasonable (not more than 50 years ago for work experience)
    const minStartDate = new Date(now.getFullYear() - 50, now.getMonth(), now.getDate());
    if (start < minStartDate) {
        return { valid: false, error: 'Start date seems too far in the past.' };
    }
    if (!isCurrent && endDate) {
        if (!validator_1.default.isISO8601(endDate)) {
            return { valid: false, error: 'Invalid end date format.' };
        }
        const end = new Date(endDate);
        if (end > now) {
            return { valid: false, error: 'End date cannot be in the future unless marked as current.' };
        }
        if (end <= start) {
            return { valid: false, error: 'End date must be after start date.' };
        }
    }
    return { valid: true };
};
exports.validateExperienceDates = validateExperienceDates;
const validateEducationDates = (startDate, endDate, isCurrent) => {
    if (!validator_1.default.isISO8601(startDate)) {
        return { valid: false, error: 'Invalid start date format.' };
    }
    const start = new Date(startDate);
    const now = new Date();
    if (start > now) {
        return { valid: false, error: 'Start date cannot be in the future.' };
    }
    // For education, allow longer history (up to 70 years for lifelong learning)
    const minStartDate = new Date(now.getFullYear() - 70, now.getMonth(), now.getDate());
    if (start < minStartDate) {
        return { valid: false, error: 'Start date seems too far in the past.' };
    }
    if (!isCurrent && endDate) {
        if (!validator_1.default.isISO8601(endDate)) {
            return { valid: false, error: 'Invalid end date format.' };
        }
        const end = new Date(endDate);
        if (end > now) {
            return { valid: false, error: 'End date cannot be in the future unless marked as current.' };
        }
        if (end <= start) {
            return { valid: false, error: 'End date must be after start date.' };
        }
    }
    return { valid: true };
};
exports.validateEducationDates = validateEducationDates;
// Sanitization functions
const sanitizeTextInput = (text) => {
    if (!text || typeof text !== 'string')
        return '';
    // Remove XSS vulnerabilities
    let sanitized = (0, xss_1.default)(text, xssOptions);
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    return sanitized;
};
exports.sanitizeTextInput = sanitizeTextInput;
const sanitizeBio = (bio) => {
    if (!bio || typeof bio !== 'string')
        return '';
    // Allow more HTML tags for bio but still sanitize
    const bioXssOptions = {
        ...xssOptions,
        whiteList: {
            ...xssOptions.whiteList,
            'ul': [],
            'ol': [],
            'li': [],
            'h3': [],
            'h4': [],
        }
    };
    let sanitized = (0, xss_1.default)(bio, bioXssOptions);
    // Normalize line breaks
    sanitized = sanitized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    // Remove excessive line breaks (more than 2 consecutive)
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
    return sanitized.trim();
};
exports.sanitizeBio = sanitizeBio;
const sanitizePhoneNumber = (phone) => {
    if (!phone || typeof phone !== 'string')
        return '';
    // Remove XSS and keep only valid phone characters
    let sanitized = (0, xss_1.default)(phone, { whiteList: {}, stripIgnoreTag: true });
    // Keep only digits, spaces, hyphens, parentheses, and plus sign
    sanitized = sanitized.replace(/[^\d\s\-\(\)\+]/g, '');
    return sanitized.trim();
};
exports.sanitizePhoneNumber = sanitizePhoneNumber;
const sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string')
        return '';
    // Basic URL sanitization
    const sanitized = (0, xss_1.default)(url, { whiteList: {}, stripIgnoreTag: true });
    // Validate URL format
    if (validator_1.default.isURL(sanitized)) {
        return sanitized;
    }
    return '';
};
exports.sanitizeUrl = sanitizeUrl;
// Enhanced validation middleware
exports.enhancedProfileValidation = [
    // Basic information
    (0, express_validator_1.body)('firstName')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 50 })
        .withMessage('First name must be 1-50 characters')
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, apostrophes, and dots'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name must be 1-50 characters')
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage('Last name can only contain letters, spaces, hyphens, apostrophes, and dots'),
    (0, express_validator_1.body)('phoneNumber')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizePhoneNumber)(value))
        .custom((value) => {
        if (value && !(0, exports.validatePhoneNumber)(value)) {
            throw new Error('Invalid phone number format');
        }
        return true;
    }),
    (0, express_validator_1.body)('dateOfBirth')
        .optional()
        .custom((value) => {
        if (value) {
            const validation = (0, exports.validateDateOfBirth)(value);
            if (!validation.valid) {
                throw new Error(validation.error || 'Invalid date of birth');
            }
        }
        return true;
    }),
    // Location information
    (0, express_validator_1.body)('address')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 200 })
        .withMessage('Address must be less than 200 characters'),
    (0, express_validator_1.body)('city')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 50 })
        .withMessage('City must be less than 50 characters')
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage('City can only contain letters, spaces, hyphens, apostrophes, and dots'),
    (0, express_validator_1.body)('country')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 50 })
        .withMessage('Country must be less than 50 characters')
        .matches(/^[a-zA-Z\s\-\'\.]+$/)
        .withMessage('Country can only contain letters, spaces, hyphens, apostrophes, and dots'),
    (0, express_validator_1.body)('postalCode')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 20 })
        .withMessage('Postal code must be less than 20 characters')
        .matches(/^[a-zA-Z0-9\s\-]+$/)
        .withMessage('Postal code contains invalid characters'),
    (0, express_validator_1.body)('district')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 50 })
        .withMessage('District must be less than 50 characters'),
    // Bio and description
    (0, express_validator_1.body)('bio')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeBio)(value))
        .isLength({ max: 2000 })
        .withMessage('Bio must be less than 2000 characters'),
    // Job status
    (0, express_validator_1.body)('jobStatus')
        .optional()
        .isIn(['unemployed', 'employed', 'self_employed'])
        .withMessage('Invalid job status'),
];
// Enhanced experience validation
exports.enhancedExperienceValidation = [
    (0, express_validator_1.body)('role')
        .notEmpty()
        .withMessage('Role is required')
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 100 })
        .withMessage('Role must be 1-100 characters'),
    (0, express_validator_1.body)('employerName')
        .notEmpty()
        .withMessage('Employer name is required')
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 100 })
        .withMessage('Employer name must be 1-100 characters'),
    (0, express_validator_1.body)('location')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ max: 100 })
        .withMessage('Location must be less than 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .customSanitizer((value) => (0, exports.sanitizeBio)(value))
        .isLength({ max: 2000 })
        .withMessage('Description must be less than 2000 characters'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .custom((value, { req }) => {
        const validation = (0, exports.validateExperienceDates)(value, req.body.endDate, req.body.isCurrent);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid date range');
        }
        return true;
    }),
    (0, express_validator_1.body)('endDate')
        .optional()
        .custom((value, { req }) => {
        if (value && !req.body.isCurrent) {
            const validation = (0, exports.validateExperienceDates)(req.body.startDate, value, false);
            if (!validation.valid) {
                throw new Error(validation.error || 'Invalid date range');
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('isCurrent')
        .optional()
        .isBoolean()
        .withMessage('isCurrent must be a boolean'),
];
// Enhanced education validation
exports.enhancedEducationValidation = [
    (0, express_validator_1.body)('school')
        .notEmpty()
        .withMessage('School is required')
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 150 })
        .withMessage('School name must be 1-150 characters'),
    (0, express_validator_1.body)('degree')
        .notEmpty()
        .withMessage('Degree is required')
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 100 })
        .withMessage('Degree must be 1-100 characters'),
    (0, express_validator_1.body)('fieldOfStudy')
        .notEmpty()
        .withMessage('Field of study is required')
        .customSanitizer((value) => (0, exports.sanitizeTextInput)(value))
        .isLength({ min: 1, max: 100 })
        .withMessage('Field of study must be 1-100 characters'),
    (0, express_validator_1.body)('startDate')
        .notEmpty()
        .withMessage('Start date is required')
        .custom((value, { req }) => {
        const validation = (0, exports.validateEducationDates)(value, req.body.endDate, req.body.isCurrent);
        if (!validation.valid) {
            throw new Error(validation.error || 'Invalid date range');
        }
        return true;
    }),
    (0, express_validator_1.body)('endDate')
        .optional()
        .custom((value, { req }) => {
        if (value && !req.body.isCurrent) {
            const validation = (0, exports.validateEducationDates)(req.body.startDate, value, false);
            if (!validation.valid) {
                throw new Error(validation.error || 'Invalid date range');
            }
        }
        return true;
    }),
];
// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.path || error.param || 'unknown',
            message: error.msg,
            value: error.value
        }));
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
// Rate limiting for profile updates (prevent spam)
exports.profileUpdateLimiter = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each user to 20 requests per windowMs
    message: {
        success: false,
        message: 'Too many profile updates. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
};
//# sourceMappingURL=profileValidation.js.map