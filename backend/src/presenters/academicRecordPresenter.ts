import type { AcademicRecord } from '@prisma/client';

export function academicRecordPresenter(record: AcademicRecord) {
  return {
    id: record.id,
    activity: record.activity,
    subject: record.academicDiscipline,
    result: record.score,
    maxScore: record.maxScore,
    date: record.realizedAt.toISOString(),
    type: record.type,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
  };
}
