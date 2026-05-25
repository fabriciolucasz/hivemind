import { Router } from 'express';
import authRoutes from './authRoutes';
import dailyLogRoutes from './dailyLogRoutes';
import dashboardRoutes from './dashboardRoutes'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/api', dailyLogRoutes);
router.use('/api/dashboard', dashboardRoutes); 

export { router };