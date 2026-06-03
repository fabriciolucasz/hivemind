import { prisma } from '../database/prisma';
import type {
  CreateAcademicRecordRequest,
  UpdateAcademicRecordRequest,
} from '../models/academicRecordModel';

async function findProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Perfil não encontrado');
  }

  return profile;
}

export async function listAcademicRecordsService(userId: string) {
  if (!userId) {
    throw new Error('Usuário não informado');
  }

  return prisma.academicRecord.findMany({
    where: {
      profile: {
        userId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createAcademicRecordService(
  data: CreateAcademicRecordRequest
) {
  if (!data.userId) {
    throw new Error('Usuário não informado');
  }

  if (!data.activity || !data.subject || data.result === undefined) {
    throw new Error('Atividade, disciplina e nota são obrigatórias');
  }

  const profile = await findProfileByUserId(data.userId);

  return prisma.academicRecord.create({
    data: {
      activity: data.activity,
      academicDiscipline: data.subject,
      score: data.result,
      maxScore: data.maxScore || 10,
      type: data.type || 'test',
      notes: data.notes || null,
      realizedAt: data.date ? new Date(`${data.date}T00:00:00`) : new Date(),
      profileId: profile.id,
    },
  });
}

export async function updateAcademicRecordService(
  id: string,
  userId: string,
  data: UpdateAcademicRecordRequest
) {
  if (!id || !userId) {
    throw new Error('Registro ou usuário não informado');
  }

  const record = await prisma.academicRecord.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!record) {
    throw new Error('Registro acadêmico não encontrado');
  }

  return prisma.academicRecord.update({
    where: { id },
    data: {
      ...(data.activity !== undefined && { activity: data.activity }),
      ...(data.subject !== undefined && { academicDiscipline: data.subject }),
      ...(data.result !== undefined && { score: data.result }),
      ...(data.maxScore !== undefined && { maxScore: data.maxScore }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.date !== undefined && {
        realizedAt: new Date(`${data.date}T00:00:00`),
      }),
    },
  });
}

export async function deleteAcademicRecordService(
  id: string,
  userId: string
) {
  if (!id || !userId) {
    throw new Error('Registro ou usuário não informado');
  }

  const record = await prisma.academicRecord.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!record) {
    throw new Error('Registro acadêmico não encontrado');
  }

  await prisma.academicRecord.delete({
    where: { id },
  });
}
