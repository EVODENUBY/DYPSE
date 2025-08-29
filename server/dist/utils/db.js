import mongoose from 'mongoose';
export const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const options = {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
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
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
};
//# sourceMappingURL=db.js.map