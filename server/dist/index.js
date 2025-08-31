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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const staticRoutes_1 = __importDefault(require("./routes/staticRoutes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const jobScraper_job_1 = require("./jobs/jobScraper.job");
const db_1 = require("./utils/db");
// Load environment variables
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse';
// Create Express app
const app = (0, express_1.default)();
// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://dypse.vercel.app', //Frontend
    'https://dypse.onrender.com' //backend's own domain
];
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            console.warn(msg);
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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
app.use('/api/auth', authRoutes_1.default);
app.use('/api/profile', profileRoutes_1.default);
app.use('/api/activities', activity_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/jobs', job_routes_1.default);
app.use('/', staticRoutes_1.default);
// Initialize job scheduler
if (process.env.NODE_ENV === 'production') {
    (0, jobScraper_job_1.scheduleJobScraping)();
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.connectDB)();
        // Start the server
        app.listen(PORT, () => {
            console.log('======================================');
            console.log(' DYPSE BACKEND API IS RUNNING');
            console.log(` http://localhost:${PORT}`);
            console.log(` MongoDB connected: ${mongoose_1.default.connection.host}`);
            console.log('======================================');
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