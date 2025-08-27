import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { requireAuth, requireRole, type AuthUser } from '../middlewares/auth';
import { prisma } from '../config/db';
import { CvDocument } from '../models/cvDocument.model';
import { ProfilePicture } from '../models/profilePicture.model';
import { UPLOADS_DIR, buildStoredFilename, ensureUploadsDir } from '../utils/storage';

// Ensure uploads directory exists
ensureUploadsDir();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
      file?: Express.Multer.File;
    }
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => cb(null, buildStoredFilename('file', file.originalname)),
});

const upload = multer({ 
  storage, 
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  } 
});

const router = Router();

// Helper function to clean up uploaded file in case of errors
async function cleanupFile(filename: string) {
  try {
    await fs.unlink(path.join(UPLOADS_DIR, filename));
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
}

// Upload profile picture (youth)
router.post('/profile-picture', 
  requireAuth, 
  requireRole(['youth']), 
  upload.single('file'), 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      if (!req.auth?.userId) {
        await cleanupFile(req.file.filename);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        await cleanupFile(req.file.filename);
        return res.status(400).json({ error: 'Only JPG, PNG, and GIF files are allowed' });
      }
      
      const profile = await prisma.youthProfile.findUnique({ 
        where: { userId: req.auth.userId } 
      });
      
      if (!profile) {
        await cleanupFile(req.file.filename);
        return res.status(404).json({ error: 'Profile not found' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      try {
        const doc = await ProfilePicture.create({
          userId: req.auth.userId,
          profileId: profile.id,
          originalFileName: req.file.originalname,
          storedFileName: req.file.filename,
          fileUrl,
          mimeType: req.file.mimetype,
        });
        
        const updated = await prisma.youthProfile.update({ 
          where: { userId: req.auth.userId }, 
          data: { profilePicId: doc._id.toString() } 
        });
        
        return res.status(201).json({ 
          id: doc._id, 
          fileUrl, 
          profile: updated 
        });
      } catch (error) {
        await cleanupFile(req.file.filename);
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
);

// Upload CV file (youth)
router.post('/cv', 
  requireAuth, 
  requireRole(['youth']), 
  upload.single('file'), 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      if (!req.auth?.userId) {
        await cleanupFile(req.file.filename);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      // Validate file type for CV
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(req.file.mimetype)) {
        await cleanupFile(req.file.filename);
        return res.status(400).json({ 
          error: 'Only PDF and Word documents are allowed for CV uploads' 
        });
      }
      
      const profile = await prisma.youthProfile.findUnique({ 
        where: { userId: req.auth.userId } 
      });
      
      if (!profile) {
        await cleanupFile(req.file.filename);
        return res.status(404).json({ error: 'Profile not found' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      
      try {
        const doc = await CvDocument.create({
          userId: req.auth.userId,
          profileId: profile.id,
          originalFileName: req.file.originalname,
          storedFileName: req.file.filename,
          fileUrl,
          mimeType: req.file.mimetype,
        });
        
        return res.status(201).json({ 
          id: doc._id, 
          fileUrl 
        });
      } catch (error) {
        await cleanupFile(req.file.filename);
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;

