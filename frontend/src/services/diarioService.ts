const API_URL =
  'http://localhost:3000/api';

export async function listarRelatos(
  userId: string
) {

  const response = await fetch(
    `${API_URL}/relatos/${userId}`
  );

  if (!response.ok) {

    throw new Error(
      'Erro ao buscar relatos'
    );

  }

  return response.json();

}

interface CriarRelatoData {
  texto: string;
  tags: string[];
  emoji: string;
  data: string;
  hora: string;
  userId: string;
}

export async function criarRelato(
  data: CriarRelatoData
) {

  const response = await fetch(
    `${API_URL}/relatos`,
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