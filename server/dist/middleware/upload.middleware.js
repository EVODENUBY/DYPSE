"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldFile = exports.handleUploadError = exports.uploadCV = exports.uploadProfilePicture = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
};
// Configure storage for profile pictures
const profilePictureStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), 'uploads/profile-pictures');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.id || 'unknown';
        const fileExtension = path_1.default.extname(file.originalname);
        const fileName = `profile_${userId}_${Date.now()}${fileExtension}`;
        cb(null, fileName);
    }
});
// Configure storage for CV uploads
const cvStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), 'uploads/cvs');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.id || 'unknown';
        const fileExtension = path_1.default.extname(file.originalname);
        const fileName = `cv_${userId}_${Date.now()}${fileExtension}`;
        cb(null, fileName);
    }
});
// File filter for profile pictures (images only)
const imageFileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed for profile pictures'));
    }
};
// File filter for CV uploads (documents only)
const documentFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF and Word documents are allowed for CV uploads'));
    }
};
// Multer configurations
exports.uploadProfilePicture = (0, multer_1.default)({
    storage: profilePictureStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
exports.uploadCV = (0, multer_1.default)({
    storage: cvStorage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
// Error handling middleware for multer errors
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum allowed size is 5MB for images and 10MB for documents.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field.'
            });
        }
    }
    if (error.message.includes('Only image files') || error.message.includes('Only PDF')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next(error);
};
exports.handleUploadError = handleUploadError;
// Cleanup old files helper
const cleanupOldFile = (filePath) => {
    if (filePath && fs_1.default.existsSync(filePath)) {
        try {
            fs_1.default.unlinkSync(filePath);
        }
        catch (error) {
            console.error('Error deleting old file:', error);
        }
    }
};
exports.cleanupOldFile = cleanupOldFile;
//# sourceMappingURL=upload.middleware.js.map