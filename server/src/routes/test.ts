import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/test-auth', requireAuth, (req, res) => {
  res.json({ 
    message: 'You are authenticated!',
    user: req.auth
  });
});

export default router;
