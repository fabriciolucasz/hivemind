import { Router } from 'express';
import authRoutes from './authRoutes';
import diarioRoutes from './diarioRoutes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/api', diarioRoutes);

export { router };