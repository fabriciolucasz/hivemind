import { Router } from 'express';
import { generateRecommendation } from '../controllers/recommendationController';

const router = Router();

// Rota para gerar recomendação (Mock ativado temporariamente)
router.post('/recommendations/generate', generateRecommendation);

export default router;
