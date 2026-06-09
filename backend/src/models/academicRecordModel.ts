export interface CreateAcademicRecordRequest {
  userId: string;
  activity: string;
  subject: string;
  result: number;
  maxScore: number;
  date: string;
  type: string;
  notes?: string;
}

export type UpdateAcademicRecordRequest = Partial<
  Omit<CreateAcademicRecordRequest, 'userId'>
>;
