"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const options = {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`MongoDB connection error: ${error.message}`);
        }
        else {
            console.error('An unknown error occurred while connecting to MongoDB');
        }
        process.exit(1);
    }
    mongoose_1.default.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map