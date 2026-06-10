import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendationService';

const recommendationService = new RecommendationService();

export const generateRecommendation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    const result = await recommendationService.generateRecommendation(userId);
    
    // Se for cold start, retornamos 200 OK mas com status de insufficient_data
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error generating recommendation:', error);
    return res.status(500).json({ error: 'Failed to generate recommendation', details: error.message });
  }
};
