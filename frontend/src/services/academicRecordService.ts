import { api } from './api';
import type {
  AcademicRecord,
  CreateAcademicRecordData,
  UpdateAcademicRecordData,
} from '../types/academicRecord';

export async function listAcademicRecords(): Promise<AcademicRecord[]> {
  const response = await api.get('/api/academic-records');
  return response.data;
}

export async function createAcademicRecord(
  data: CreateAcademicRecordData
): Promise<AcademicRecord> {
  const response = await api.post('/api/academic-records', data);
  return response.data;
}

export async function updateAcademicRecord(
  id: string,
  data: UpdateAcademicRecordData
): Promise<AcademicRecord> {
  const response = await api.put(`/api/academic-records/${id}`, data);
  return response.data;
}

export async function deleteAcademicRecord(id: string): Promise<void> {
  await api.delete(`/api/academic-records/${id}`);
}
