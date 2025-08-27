import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

export const prisma = new PrismaClient();

export async function connectMongo(): Promise<typeof mongoose> {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI missing');
  }
  return mongoose.connect(env.mongoUri, { autoIndex: true });
}


