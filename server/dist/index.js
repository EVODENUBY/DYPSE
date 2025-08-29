import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import activityRoutes from './routes/activity.routes.js';
import staticRoutes from './routes/staticRoutes.js';
import adminRoutes from './routes/admin.routes.js';
import { connectDB } from './utils/db.js';
// Load environment variables
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse';
// Create Express app
const app = express();
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};
// Handle preflight requests
app.options('*', cors(corsOptions));
// Apply CORS middleware
app.use(cors(corsOptions));
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logging middleware
app.use(morgan('dev'));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', staticRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});
// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`MongoDB connected: ${mongoose.connection.host}`);
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