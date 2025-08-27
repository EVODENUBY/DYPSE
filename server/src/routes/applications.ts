import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';

const router = Router();

const applySchema = z.object({ jobId: z.string() });

router.post('/', requireAuth, requireRole(['youth']), async (req, res) => {
  const parse = applySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const app = await prisma.application.upsert({
    where: { jobId_profileId: { jobId: parse.data.jobId, profileId: profile.id } },
    create: { jobId: parse.data.jobId, profileId: profile.id, status: 'applied' },
    update: { status: 'applied' },
  });
  res.status(201).json(app);
});

router.get('/', requireAuth, async (req, res) => {
  const { jobId, profileId } = req.query as any;
  const where: any = {};
  if (jobId) where.jobId = String(jobId);
  if (profileId) where.profileId = String(profileId);
  const apps = await prisma.application.findMany({ where, orderBy: { appliedAt: 'desc' } });
  res.json(apps);
});

router.patch('/:id', requireAuth, requireRole(['employer', 'admin']), async (req, res) => {
  const { status, score } = req.body as any;
  const updated = await prisma.application.update({ where: { id: req.params.id }, data: { status, score } });
  res.json(updated);
});

export default router;


