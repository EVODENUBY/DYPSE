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
// API route for root
router.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Welcome to DYNAMIC YOUTH PROFILING SYSTEM(DYPSE) API',
        version: '1.0.0',
        documentation: 'Please refer to the API documentation for available endpoints',
        status: 'Running smoothly',
        timestamp: new Date().toISOString()
    });
});
// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    // Try multiple possible build output directories
    const possibleBuildDirs = [
        path_1.default.join(__dirname, '../../../client/dist'),
        path_1.default.join(__dirname, '../../../client/build'),
        path_1.default.join(__dirname, '../../../dist'),
        path_1.default.join(__dirname, '../../../build')
    ];
    let clientBuildPath = '';
    // Find the first existing build directory
    for (const dir of possibleBuildDirs) {
        if (fs_1.default.existsSync(dir)) {
            clientBuildPath = dir;
            console.log(`Serving static files from: ${clientBuildPath}`);
            break;
        }
    }
    if (clientBuildPath) {
        // Serve static files from the React app
        router.use(express_1.default.static(clientBuildPath));
        // Handle client-side routing - return index.html for all non-API routes
        router.get('*', (req, res) => {
            // Skip API routes
            if (req.path.startsWith('/api/')) {
                return res.status(404).json({ success: false, message: 'API endpoint not found' });
            }
            // Serve index.html for all other routes
            res.sendFile(path_1.default.join(clientBuildPath, 'index.html'));
        });
    }
    else {
        console.warn('No client build directory found. Make sure to build the React app for production.');
    }
}
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