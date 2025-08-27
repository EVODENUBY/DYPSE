import express from 'express';
const router = express.Router();
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';

const createJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  requiredSkills: z.array(z.object({ skillId: z.string(), weight: z.number().min(0).max(1).default(1) })).optional(),
  location: z.string().optional(),
  isRemote: z.boolean().optional(),
  salaryRange: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  status: z.string().optional(),
});

router.post('/', requireAuth, requireRole(['employer']), async (req, res) => {
  const parse = createJobSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data;
  const job = await prisma.job.create({
    data: {
      employer:{
        connect:{
          id:req.auth!.userId
        }
      },
      employerProfile:{
        connect:{
          id:req.auth!.userId
        }
      },
      title: data.title,
      description: data.description,
      requiredSkills: data.requiredSkills ? data.requiredSkills : undefined,
      location: data.location,
      isRemote: data.isRemote ?? false,
      salaryRange: data.salaryRange,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      status: data.status,
    },
  });
  res.status(201).json(job);
});

router.get('/', requireAuth, async (req, res) => {
  const { skill, location, readiness_score_min } = req.query as any;
  const where: any = {};
  if (location) where.location = { contains: String(location), mode: 'insensitive' };
  const jobs = await prisma.job.findMany({
    where,
    orderBy: { postedAt: 'desc' },
    take: 50,
  });
  // For MVP we ignore readiness_score_min and skill filter on server; can extend later.
  res.json(jobs);
});

router.get('/:id/candidates', requireAuth, requireRole(['employer', 'admin']), async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });

  // Simplified matching: top profiles by readiness + optional location proximity.
  const candidates = await prisma.youthProfile.findMany({
    where: {
      ...(job.location ? {
        OR: [
          { address: { contains: job.location, mode: 'insensitive' } },
          { district: { contains: job.location, mode: 'insensitive' } },
          { city: { contains: job.location, mode: 'insensitive' } },
          { state: { contains: job.location, mode: 'insensitive' } },
          { country: { contains: job.location, mode: 'insensitive' } }
        ]
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json(candidates);
});

export default router;

router.post('/:id/invite/:profileId', requireAuth, requireRole(['employer']), async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const profile = await prisma.youthProfile.findUnique({ where: { id: req.params.profileId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  // Create or upsert application with status 'shortlisted'
  const app = await prisma.application.upsert({
    where: { jobId_profileId: { jobId: job.id, profileId: profile.id } },
    create: { jobId: job.id, profileId: profile.id, status: 'shortlisted' },
    update: { status: 'shortlisted' },
  });
  res.status(201).json(app);
});


