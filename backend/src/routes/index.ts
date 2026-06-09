import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';
<<<<<<< HEAD
=======
import dashboardRoutes from './dashboardRoutes';
import vocationalTestRoutes from './vocationalTestRoutes';
import recommendationRoutes from './recommendationRoutes';
import academicRecordRoutes from './academicRecordRoutes';
import profileRoutes from './profileRoutes';
>>>>>>> 903e9688de3d6508b6f32d72032070ce9a939a76

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);
<<<<<<< HEAD
=======
router.use('/api/dashboard', dashboardRoutes);
router.use('/api', vocationalTestRoutes);
router.use('/api', recommendationRoutes);
router.use('/api', academicRecordRoutes);
router.use('/api', profileRoutes);
>>>>>>> 903e9688de3d6508b6f32d72032070ce9a939a76

export { router };