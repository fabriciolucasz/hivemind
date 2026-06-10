import { useCallback, useEffect, useState } from 'react';

import {
  createVocationalTest,
  deleteVocationalTest,
  listVocationalTests,
} from '../services/vocationalTestService';
import type {
  CreateVocationalTestData,
  VocationalTestType,
} from '../types/vocationalTest';

export function useVocationalTests(userId?: string) {
  const [testHistory, setTestHistory] = useState<VocationalTestType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadTests = useCallback(async () => {
    if (!userId) {
      setTestHistory([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await listVocationalTests();
      setTestHistory(data);
    } catch (loadError) {
      console.error(loadError);
      setError('Não foi possível carregar o histórico de testes.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const addTest = useCallback(async (data: CreateVocationalTestData) => {
    try {
      setIsSubmitting(true);
      const createdTest = await createVocationalTest(data);
      setTestHistory((history) => [createdTest, ...history]);

      return createdTest;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeTest = useCallback(
    async (testId: string) => {
      if (!userId) {
        throw new Error('Usuário não informado');
      }

      await deleteVocationalTest(testId);
      setTestHistory((history) => history.filter((test) => test.id !== testId));
    },
    [userId]
  );

  return {
    testHistory,
    isLoading,
    isSubmitting,
    error,
    setError,
    addTest,
    removeTest,
    reloadTests: loadTests,
  };
}
