import { api } from './api';

import type { CreateDailyLogData, DailyLog } from '../types/dailyLog';

const API_URL = 'http://localhost:3000/api/daily-logs';

export async function listDailyLogs(
  userId: string
): Promise<DailyLog[]> {

  const response = await fetch(`${API_URL}/${userId}`);

  if (!response.ok) {

    throw new Error(
      'Erro ao buscar relatos'
    );

  }

  return response.json();

}

export async function createDailyLog(
  data: CreateDailyLogData
): Promise<DailyLog> {

  const response = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {

    throw new Error(
      'Erro ao criar relato'
    );

  }

  return response.json();

}

export async function deleteDailyLog(id: string) {
  await api.delete(`/api/daily-logs/${id}`); 
}