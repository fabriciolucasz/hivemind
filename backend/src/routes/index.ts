import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';
import vocationalTestRoutes from './vocationalTestRoutes';
import academicRecordRoutes from './academicRecordRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);
router.use('/api', vocationalTestRoutes);
router.use('/api', academicRecordRoutes);

export { router };
