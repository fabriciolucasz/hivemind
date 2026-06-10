import { api } from './api';
import type { RecommendationResponse } from '../types/recommendation';

export async function generateRecommendation(): Promise<RecommendationResponse> {
  const response = await api.post('/api/recommendations/generate');
  return response.data;
}

