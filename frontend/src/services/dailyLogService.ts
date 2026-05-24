const API_URL =
  'http://localhost:3000/api';

export async function listDailyLogs(
  userId: string
) {

  const response = await fetch(
    `${API_URL}/daily-logs/${userId}`
  );

  if (!response.ok) {

    throw new Error(
      'Erro ao buscar relatos'
    );

  }

  return response.json();

}

interface CreateDailyLogData {
  text: string;
  tags: string[];
  emoji: string;
  date: string;
  time: string;
  userId: string;
}

export async function createDailyLog(
  data: CreateDailyLogData
) {

  const response = await fetch(
    `${API_URL}/daily-logs`,
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
