import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import { ensureUploadsDir, UPLOADS_DIR } from './utils/storage';
import cookieParser from 'cookie-parser';
import { listRoutes } from './utils/route-utils';
import { env } from './config/env';

const app = express();

app.use(cors({
  origin: [env.frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Debug route to list all registered routes
app.get('/api/debug/routes', listRoutes);

// Mount all API routes under /api
app.use('/api', routes);

// Serve uploaded files statically
ensureUploadsDir();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;
