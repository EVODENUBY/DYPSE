import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';
import { writeAuditLog } from '../utils/audit';

const router = Router();

const schema = z.object({
  employerName: z.string(),
  role: z.string(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  description: z.string().optional(),
  isCurrent: z.boolean().optional(),
});

router.get('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const items = await prisma.experience.findMany({ where: { profileId: profile.id } });
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
  const created = await prisma.experience.create({ data: { ...data, profileId: profile.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'experience.create', entityType: 'Experience', entityId: created.id });
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireRole(['youth', 'admin']), async (req, res) => {
  const parse = schema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data: any = { ...parse.data };
  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);
  const updated = await prisma.experience.update({ where: { id: req.params.id }, data });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'experience.update', entityType: 'Experience', entityId: updated.id });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole(['youth', 'admin']), async (req, res) => {
  await prisma.experience.delete({ where: { id: req.params.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'experience.delete', entityType: 'Experience', entityId: req.params.id });
  res.status(204).send();
});

export default router;


