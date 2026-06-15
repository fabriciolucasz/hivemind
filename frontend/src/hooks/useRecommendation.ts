import { useCallback, useState } from 'react';

import { generateRecommendation } from '../services/recommendationService';
import type { RecommendationResponse } from '../types/recommendation';

export function useRecommendation(userId?: string) {
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const requestRecommendation = useCallback(async () => {
    if (!userId) {
      const message = 'Faca login para gerar uma recomendacao.';
      setError(message);
      throw new Error(message);
    }

    try {
      setIsGenerating(true);
      setError('');

      const data = await generateRecommendation();
      setRecommendation(data);

      return data;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : 'Nao foi possivel gerar a recomendacao.';

      setError(message);
      throw requestError;
    } finally {
      setIsGenerating(false);
    }
  }, [userId]);

  const resetRecommendation = useCallback(() => {
    setRecommendation(null);
    setError('');
  }, []);

  return {
    recommendation,
    isGenerating,
    error,
    requestRecommendation,
    resetRecommendation,
  };
}
