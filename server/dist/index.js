"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const profileRoutes_js_1 = __importDefault(require("./routes/profileRoutes.js"));
const activity_routes_js_1 = __importDefault(require("./routes/activity.routes.js"));
const staticRoutes_js_1 = __importDefault(require("./routes/staticRoutes.js"));
const admin_routes_js_1 = __importDefault(require("./routes/admin.routes.js"));
const db_js_1 = require("./utils/db.js");
// Load environment variables
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse';
// Create Express app
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
// Handle preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// Apply CORS middleware
app.use((0, cors_1.default)(corsOptions));
// Body parser middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging middleware
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/profile', profileRoutes_js_1.default);
app.use('/api/activities', activity_routes_js_1.default);
app.use('/api/admin', admin_routes_js_1.default);
app.use('/', staticRoutes_js_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_js_1.connectDB)();
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`MongoDB connected: ${mongoose_1.default.connection.host}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Start the application
startServer();
//# sourceMappingURL=index.js.map