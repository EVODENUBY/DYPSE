import { Router } from 'express';
import authRouter from './auth';
import profilesRouter from './profiles';
import jobsRouter from './jobs';
import adminRouter from './admin';
import searchRouter from './search';
import dashboardRouter from './dashboard';
import applicationsRouter from './applications';
import skillsRouter from './skills';
import uploadsRouter from './uploads';
import educationsRouter from './educations';
import experiencesRouter from './experiences';
import businessesRouter from './businesses';
import testRouter from './test';
import chatRouter from './chat';
import notificationsRouter from './notifications';

const router = Router();

// Test routes
router.use('/test', testRouter);

router.use('/auth', authRouter);
router.use('/profiles', profilesRouter);
router.use('/jobs', jobsRouter);
router.use('/admin', adminRouter);
router.use('/search', searchRouter);
router.use('/dashboard', dashboardRouter);
router.use('/applications', applicationsRouter);
router.use('/skills', skillsRouter);
router.use('/uploads', uploadsRouter);
router.use('/educations', educationsRouter);
router.use('/experiences', experiencesRouter);
router.use('/businesses', businessesRouter);
router.use('/chat', chatRouter);
router.use('/notifications', notificationsRouter);

export default router;


