import type { RecommendationResponse } from '../types/recommendation';

const API_URL = 'http://localhost:3000/api/recommendations/generate';

export async function generateRecommendation(
  userId: string
): Promise<RecommendationResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.details || data?.error || 'Erro ao gerar recomendacao');
  }

  return data;
}

