import type {
  AcademicRecord,
  CreateAcademicRecordData,
  UpdateAcademicRecordData,
} from '../types/academicRecord';

const API_URL = 'http://localhost:3000/api/academic-records';

export async function listAcademicRecords(
  userId: string
): Promise<AcademicRecord[]> {
  const response = await fetch(`${API_URL}/${userId}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar registros acadêmicos');
  }

  return response.json();
}

export async function createAcademicRecord(
  data: CreateAcademicRecordData
): Promise<AcademicRecord> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar registro acadêmico');
  }

  return response.json();
}

export async function updateAcademicRecord(
  id: string,
  userId: string,
  data: UpdateAcademicRecordData
): Promise<AcademicRecord> {
  const response = await fetch(`${API_URL}/${id}?userId=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar registro acadêmico');
  }

  return response.json();
}

export async function deleteAcademicRecord(id: string, userId: string) {
  const response = await fetch(`${API_URL}/${id}?userId=${userId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erro ao excluir registro acadêmico');
  }
}
