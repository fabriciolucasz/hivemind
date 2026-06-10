import { api } from './api';
import type { CreateDailyLogData, DailyLog } from '../types/dailyLog';

export async function listDailyLogs(): Promise<DailyLog[]> {
  const response = await api.get('/api/daily-logs');
  return response.data;
}

export async function createDailyLog(
  data: CreateDailyLogData
): Promise<DailyLog> {
  const response = await api.post('/api/daily-logs', data);
  return response.data;
}

export async function deleteDailyLog(id: string): Promise<void> {
  await api.delete(`/api/daily-logs/${id}`);
}