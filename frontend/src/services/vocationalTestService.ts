import type {
  CreateVocationalTestData,
  VocationalTestType,
} from '../types/vocationalTest';

const API_URL = 'http://localhost:3000/api/vocational-tests';

export async function listVocationalTests(
  userId: string
): Promise<VocationalTestType[]> {
  const response = await fetch(`${API_URL}/${userId}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar testes vocacionais');
  }

  return response.json();
}

export async function createVocationalTest(
  data: CreateVocationalTestData
): Promise<VocationalTestType> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar teste vocacional');
  }

  return response.json();
}

export async function deleteVocationalTest(
  id: string,
  userId: string
) {
  const response = await fetch(`${API_URL}/${id}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erro ao excluir teste vocacional');
  }
}
