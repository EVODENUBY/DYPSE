import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';
import { writeAuditLog } from '../utils/audit';

const router = Router();

const schema = z.object({
  businessName: z.string(),
  businessType: z.string().optional(),
  revenueEstimate: z.number().optional(),
  registrationStatus: z.string().optional(),
  needsSupport: z.string().optional(),
});

router.get('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const items = await prisma.business.findMany({ where: { profileId: profile.id } });
  res.json(items);
});

router.post('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const created = await prisma.business.create({ data: { ...parse.data, profileId: profile.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'business.create', entityType: 'Business', entityId: created.id });
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireRole(['youth', 'admin']), async (req, res) => {
  const parse = schema.partial().safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const updated = await prisma.business.update({ where: { id: req.params.id }, data: parse.data });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'business.update', entityType: 'Business', entityId: updated.id });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole(['youth', 'admin']), async (req, res) => {
  await prisma.business.delete({ where: { id: req.params.id } });
  await writeAuditLog({ actorId: req.auth!.userId, action: 'business.delete', entityType: 'Business', entityId: req.params.id });
  res.status(204).send();
});

export default router;


