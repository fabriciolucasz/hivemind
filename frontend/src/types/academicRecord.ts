export type AcademicRecordType = 'test' | 'assignment' | 'presentation' | 'project';

export interface AcademicRecord {
  id: string;
  activity: string;
  subject: string;
  result: number;
  maxScore: number;
  date: string;
  type: AcademicRecordType;
  notes?: string | null;
  createdAt?: string;
}

export interface CreateAcademicRecordData {
  userId: string;
  activity: string;
  subject: string;
  result: number;
  maxScore: number;
  date: string;
  type: AcademicRecordType;
  notes?: string;
}

export type UpdateAcademicRecordData = Partial<
  Omit<CreateAcademicRecordData, 'userId'>
>;
