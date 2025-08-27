import { Router } from 'express';
import { prisma } from '../config/db';
import { requireAuth, requireRole } from '../middlewares/auth';
import { z } from 'zod';
import { CvDocument } from '../models/cvDocument.model';

const router = Router();

router.get('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const me = await prisma.youthProfile.findUnique({
    where: { userId: req.auth!.userId },
    include: { educations: true, experiences: true, skills: { include: { skill: true } }, businesses: true },
  });
  res.json(me);
});

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().datetime().optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bio: z.string().optional(),
  jobStatus: z.enum(['unemployed', 'employed', 'self_employed']).optional(),
  profilePictureUrl: z.string().url().optional(),
});

router.put('/me', requireAuth, requireRole(['youth']), async (req, res) => {
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data as any;
  if (data.dob) data.dob = new Date(data.dob);
  const updated = await prisma.youthProfile.update({ where: { userId: req.auth!.userId }, data });
  res.json(updated);
});

export default router;

const cvSchema = z.object({
  text: z.string().min(50),
  originalFileName: z.string().optional(),
  mimeType: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

router.post('/me/cv', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const parse = cvSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const doc = await CvDocument.create({
    userId: req.auth!.userId,
    profileId: profile.id,
    originalFileName: parse.data.originalFileName,
    mimeType: parse.data.mimeType,
    text: parse.data.text,
    keywords: parse.data.keywords ?? [],
  });
  res.status(201).json({ id: doc._id });
});

const upsertSkillSchema = z.object({ skillId: z.string(), level: z.enum(['beginner', 'intermediate', 'expert']), yearsExperience: z.number().int().min(0).max(60).optional() });

router.get('/me/skills', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId }, include: { skills: { include: { skill: true } } } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile.skills);
});

router.post('/me/skills', requireAuth, requireRole(['youth']), async (req, res) => {
  const parse = upsertSkillSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  const ps = await prisma.profileSkill.upsert({
    where: { profileId_skillId: { profileId: profile.id, skillId: parse.data.skillId } },
    create: { profileId: profile.id, skillId: parse.data.skillId, level: parse.data.level as any, yearsExperience: parse.data.yearsExperience ?? 0 },
    update: { level: parse.data.level as any, yearsExperience: parse.data.yearsExperience ?? 0 },
  });
  res.status(201).json(ps);
});

router.delete('/me/skills/:skillId', requireAuth, requireRole(['youth']), async (req, res) => {
  const profile = await prisma.youthProfile.findUnique({ where: { userId: req.auth!.userId } });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  await prisma.profileSkill.delete({ where: { profileId_skillId: { profileId: profile.id, skillId: req.params.skillId } } });
  res.status(204).send();
});


