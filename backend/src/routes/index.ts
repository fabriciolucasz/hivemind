import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';
import dashboardRoutes from './dashboardRoutes';
import vocationalTestRoutes from './vocationalTestRoutes';
import recommendationRoutes from './recommendationRoutes';
import academicRecordRoutes from './academicRecordRoutes';
import profileRoutes from './profileRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);
router.use('/api/dashboard', dashboardRoutes);
router.use('/api', vocationalTestRoutes);
router.use('/api', recommendationRoutes);
router.use('/api', academicRecordRoutes);
router.use('/api', profileRoutes);

export { router };
