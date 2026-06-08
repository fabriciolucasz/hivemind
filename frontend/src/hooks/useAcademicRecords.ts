import { useCallback, useEffect, useState } from 'react';

import {
  createAcademicRecord,
  deleteAcademicRecord,
  listAcademicRecords,
} from '../services/academicRecordService';
import type {
  AcademicRecord,
  CreateAcademicRecordData,
} from '../types/academicRecord';

export function useAcademicRecords(userId?: string) {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecords = useCallback(async () => {
    if (!userId) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await listAcademicRecords(userId);
      setRecords(data);
    } catch (loadError) {
      console.error(loadError);
      setError('Não foi possível carregar os registros de desempenho.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback(async (data: CreateAcademicRecordData) => {
    const savedRecord = await createAcademicRecord(data);
    setRecords((currentRecords) => [savedRecord, ...currentRecords]);

    return savedRecord;
  }, []);

  const removeRecord = useCallback(
    async (recordId: string) => {
      if (!userId) {
        throw new Error('Usuário não informado');
      }

      await deleteAcademicRecord(recordId, userId);
      setRecords((currentRecords) =>
        currentRecords.filter((record) => record.id !== recordId)
      );
    },
    [userId]
  );

  return {
    records,
    isLoading,
    error,
    setError,
    addRecord,
    removeRecord,
    reloadRecords: loadRecords,
  };
}
