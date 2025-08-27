import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const { q } = req.query as any;
  const where = q ? { OR: [ { name: { contains: String(q), mode: 'insensitive' } }, { canonicalName: { contains: String(q), mode: 'insensitive' } } ] } : {};
  const items = await prisma.skill.findMany({ where, orderBy: { name: 'asc' }, take: 100 });
  res.json(items);
});

const upsertSchema = z.object({ name: z.string(), canonicalName: z.string().optional(), category: z.string().optional() });

router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  const parse = upsertSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const s = await prisma.skill.upsert({ where: { name: parse.data.name }, create: parse.data, update: parse.data });
  res.status(201).json(s);
});

export default router;


