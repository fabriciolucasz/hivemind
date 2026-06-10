import { Router } from 'express';
import { generateRecommendation } from '../controllers/recommendationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/recommendations/generate', authMiddleware, generateRecommendation);

export default router;
