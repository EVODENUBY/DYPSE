"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Serve profile pictures publicly, CVs with authentication
router.get('/uploads/profile-pictures/:filename', (req, res) => {
    const { filename } = req.params;
    const folder = 'profile-pictures';
    // Construct file path
    const filePath = path_1.default.join(process.cwd(), 'uploads', folder, filename);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    // Set appropriate headers based on file type
    const ext = path_1.default.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    // Send file
    res.sendFile(filePath);
});
// Serve CVs with authentication
router.get('/uploads/:folder/:filename', authController_1.protect, (req, res) => {
    const { folder, filename } = req.params;
    // Validate folder to prevent directory traversal
    const allowedFolders = ['profile-pictures', 'cvs'];
    if (!allowedFolders.includes(folder)) {
        return res.status(400).json({ success: false, message: 'Invalid folder' });
    }
    // Construct file path
    const filePath = path_1.default.join(process.cwd(), 'uploads', folder, filename);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    // Set appropriate headers based on file type
    const ext = path_1.default.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.pdf':
            contentType = 'application/pdf';
            break;
        case '.doc':
            contentType = 'application/msword';
            break;
        case '.docx':
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
    }
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    // Send file
    res.sendFile(filePath);
});
exports.default = router;
//# sourceMappingURL=staticRoutes.js.map