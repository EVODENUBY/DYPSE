import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';
import { hashPassword } from '../utils/password';

const router = Router();

router.get('/profiles', requireAuth, requireRole(['admin']), async (req, res) => {
  const { verified, page = '1', limit = '20' } = req.query as any;
  const take = Math.min(parseInt(String(limit), 10) || 20, 100);
  const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

  const where: any = {};
  if (verified === 'true') where.verification = { isNot: null };
  if (verified === 'false') where.verification = { is: null };

  const [items, total] = await Promise.all([
    prisma.youthProfile.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    prisma.youthProfile.count({ where }),
  ]);
  res.json({ items, total, page: Number(page), limit: take });
});

router.post('/verify/profile/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  // First check if verification exists
  const profile = await prisma.youthProfile.findUnique({
    where: { id: req.params.id },
    include: { verification: true }
  });

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  let updatedProfile;
  
  if (profile.verification) {
    // Update existing verification
    updatedProfile = await prisma.youthProfile.update({
      where: { id: req.params.id },
      data: {
        verification: {
          update: {
            status: 'verified',
            verifiedAt: new Date(),
            verifiedBy: req.user?.id
          }
        }
      },
      include: { verification: true }
    });
  } else {
    // Create new verification
    updatedProfile = await prisma.youthProfile.update({
      where: { id: req.params.id },
      data: {
        verification: {
          create: {
            status: 'verified',
            verifiedAt: new Date(),
            verifiedBy: req.user?.id
          }
        }
      },
      include: { verification: true }
    });
  }
  
  res.json(updatedProfile);
});

router.get('/audit-logs', requireAuth, requireRole(['admin']), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json(logs);
});

export default router;

// Youth management CRUD 
const createYouthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

router.get('/youth', requireAuth, requireRole(['admin']), async (req, res) => {
  const { page = '1', limit = '20', q, verified, location, status, sortBy = 'createdAt', sortDir = 'desc' } = req.query as any;
  const take = Math.min(parseInt(String(limit), 10) || 20, 100);
  const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

  const where: any = {};
  if (q) {
    const s = String(q);
    where.OR = [
      { firstName: { contains: s, mode: 'insensitive' } },
      { lastName: { contains: s, mode: 'insensitive' } },
      { bio: { contains: s, mode: 'insensitive' } },
      { location: { contains: s, mode: 'insensitive' } },
      { user: { email: { contains: s, mode: 'insensitive' } } },
    ];
  }
  if (verified === 'true') where.lastVerifiedAt = { not: null };
  if (verified === 'false') where.lastVerifiedAt = null;
  if (location) where.location = { contains: String(location), mode: 'insensitive' };
  if (status) where.jobStatus = String(status);

  // Sorting
  let orderBy: any = { createdAt: 'desc' };
  const dir = String(sortDir) === 'asc' ? 'asc' : 'desc';
  switch (String(sortBy)) {
    case 'name':
      orderBy = [{ firstName: dir }, { lastName: dir }];
      break;
    case 'email':
      orderBy = { user: { email: dir } } as any;
      break;
    case 'location':
      orderBy = { location: dir } as any;
      break;
    case 'status':
      orderBy = { jobStatus: dir } as any;
      break;
    case 'createdAt':
    default:
      orderBy = { createdAt: dir } as any;
  }

  const [items, total] = await Promise.all([
    prisma.youthProfile.findMany({
      where,
      include: {
        user: true,
        educations: true,
        experiences: true,
        skills: { include: { skill: true } },
        businesses: true,
      },
      skip,
      take,
      orderBy,
    }),
    prisma.youthProfile.count({ where }),
  ]);
  res.json({ items, total, page: Number(page), limit: take });
});

router.post('/youth', requireAuth, requireRole(['admin']), async (req, res) => {
  const parse = createYouthSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { email, password, firstName, lastName, phone } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already exists' });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, role: 'youth', phone } });
  const profile = await prisma.youthProfile.create({ 
    data: { 
      userId: user.id, 
      firstName, 
      lastName, 
      address: parse.data.location, // Using address instead of location
      jobStatus: 'unemployed' 
    } 
  });
  res.status(201).json({ user, profile });
});

const updateYouthSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bio: z.string().optional(),
  jobStatus: z.enum(['unemployed', 'employed', 'self_employed']).optional(),
  profilePictureUrl: z.string().url().optional(),
});

router.put('/youth/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const parse = updateYouthSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const updated = await prisma.youthProfile.update({ where: { id: req.params.id }, data: parse.data as any });
  res.json(updated);
});

router.delete('/youth/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { id: req.params.id } });
  if (!profile) return res.status(404).json({ error: 'Not found' });
  await prisma.$transaction([
    prisma.education.deleteMany({ where: { profileId: profile.id } }),
    prisma.experience.deleteMany({ where: { profileId: profile.id } }),
    prisma.profileSkill.deleteMany({ where: { profileId: profile.id } }),
    prisma.business.deleteMany({ where: { profileId: profile.id } }),
    prisma.application.deleteMany({ where: { profileId: profile.id } }),
    prisma.verificationReminder.deleteMany({ where: { profileId: profile.id } }),
    prisma.youthProfile.delete({ where: { id: profile.id } }),
    prisma.user.delete({ where: { id: profile.userId } }),
  ]);
  res.status(204).send();
});


