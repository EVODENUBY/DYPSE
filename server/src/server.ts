import express from 'express';
import app from './app';
import { env } from './config/env';
import { connectMongo, prisma } from './config/db';
import authRouter from './routes/auth';

async function start() {
  try {
    // Connect to databases
    await prisma.$connect();
    await connectMongo();

    // Health check route
    app.get('/', (req, res) => {
      res.send('DYPSM API IS RUNNING');
    });

    // Test API route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'API test successful', status: 'ok' });
    });

    // Mount auth routes
    app.use('/api/auth', authRouter);
    console.log('Auth routes are mounted at /api/auth');

    // Start server
    app.listen(env.port, () => {
      console.log(`Server listening on port http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
