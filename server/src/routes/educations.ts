import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';
import { writeAuditLog } from '../utils/audit';

const router = Router();

const schema = z.object({
  school: z.string(),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  verified: z.boolean().optional(),
});

router.get('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const items = await prisma.education.findMany({ where: { profileId: profile.id } });
  res.json(items);
});

router.post('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const data: any = { ...parse.data };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  const created = await prisma.education.create({ data: { ...data, profileId: profile.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'education.create', entityType: 'Education', entityId: created.id });
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireRole(['youth', 'admin','employer']), async (req, res) => {
  const parse = schema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data: any = { ...parse.data };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  const updated = await prisma.education.update({ where: { id: req.params.id }, data });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'education.update', entityType: 'Education', entityId: updated.id });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole(['youth', 'admin','employer']), async (req, res) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'education.delete', entityType: 'Education', entityId: req.params.id });
  res.status(204).send();
});

export default router;


