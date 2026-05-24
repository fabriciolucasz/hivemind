import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);

export { router };