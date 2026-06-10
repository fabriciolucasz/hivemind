import { api } from './api';
import type {
  CreateVocationalTestData,
  VocationalTestType,
} from '../types/vocationalTest';

export async function listVocationalTests(): Promise<VocationalTestType[]> {
  const response = await api.get('/api/vocational-tests');
  return response.data;
}

export async function createVocationalTest(
  data: CreateVocationalTestData
): Promise<VocationalTestType> {
  const response = await api.post('/api/vocational-tests', data);
  return response.data;
}

export async function deleteVocationalTest(id: string) {
  await api.delete(`/api/vocational-tests/${id}`);
}
