import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/profiles', requireAuth, async (req, res) => {
  const { q, skills, location, page = '1', limit = '20' } = req.query as any;
  const take = Math.min(parseInt(String(limit), 10) || 20, 50);
  const skip = (Math.max(parseInt(String(page), 10) || 1, 1) - 1) * take;

  const skillIds = typeof skills === 'string' && skills.length > 0 ? skills.split(',') : [];

  const items = await prisma.youthProfile.findMany({
    where: {
      ...(location ? { location: { contains: String(location), mode: 'insensitive' } } : {}),
      ...(q ? { OR: [
        { firstName: { contains: String(q), mode: 'insensitive' } },
        { lastName: { contains: String(q), mode: 'insensitive' } },
        { bio: { contains: String(q), mode: 'insensitive' } },
      ] } : {}),
      ...(skillIds.length > 0 ? { skills: { some: { skillId: { in: skillIds } } } } : {}),
    },
    include: { skills: { include: { skill: true } } },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ items, page: Number(page), limit: take });
});

export default router;


