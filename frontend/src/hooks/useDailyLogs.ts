import { useCallback, useEffect, useState } from 'react';

import {
  createDailyLog,
  deleteDailyLog,
  listDailyLogs,
} from '../services/dailyLogService';
import type { CreateDailyLogData, DailyLog } from '../types/dailyLog';

export function useDailyLogs(userId?: string) {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDailyLogs = useCallback(async () => {
    if (!userId) {
      setDailyLogs([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const data = await listDailyLogs(userId);
      setDailyLogs(data);
    } catch (loadError) {
      console.error('Erro ao carregar relatos:', loadError);
      setError('Não foi possível carregar os relatos.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDailyLogs();
  }, [loadDailyLogs]);

  const createLog = useCallback(async (data: CreateDailyLogData) => {
    const savedDailyLog = await createDailyLog(data);
    setDailyLogs((currentLogs) => [savedDailyLog, ...currentLogs]);

    return savedDailyLog;
  }, []);

  const deleteLog = useCallback(async (idDailyLog: string) => {
    await deleteDailyLog(idDailyLog);
    setDailyLogs((currentLogs) =>
      currentLogs.filter((log) => log.id !== idDailyLog)
    );
  }, []);
  const updateEmojiLocally = useCallback((idDailyLog: string, emoji: string) => {
    setDailyLogs((currentLogs) =>
      currentLogs.map((log) =>
        log.id === idDailyLog
          ? {
              ...log,
              emoji,
            }
          : log
      )
    );
  }, []);

  return {
    dailyLogs,
    isLoading,
    error,
    createLog,
    deleteLog,
    updateEmojiLocally,
    reloadDailyLogs: loadDailyLogs,
  };
}
