import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';
import vocationalTestRoutes from './vocationalTestRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);
router.use('/api', vocationalTestRoutes);

export { router };
