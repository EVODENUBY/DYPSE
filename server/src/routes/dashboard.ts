import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/kpis', requireAuth, requireRole(['admin']), async (_req, res) => {
  const [totalYouth, employed, businessesThisMonth, topSkills] = await Promise.all([
    prisma.youthProfile.count(),
    prisma.youthProfile.count({ where: { jobStatus: 'employed' } }),
    prisma.business.count({ where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    prisma.profileSkill.groupBy({ by: ['skillId'], _count: { skillId: true }, orderBy: { _count: { skillId: 'desc' } }, take: 3 }),
  ]);

  res.json({
    totalYouth,
    employedPercent: totalYouth > 0 ? Math.round((employed / totalYouth) * 1000) / 10 : 0,
    businessesStartedThisMonth: businessesThisMonth,
    topSkills,
  });
});

export default router;


