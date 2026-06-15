import { prisma } from '../database/prisma';
import { HfInference } from '@huggingface/inference';

interface CreateDailyLogRequest {
  text: string;
  tags: string[];
  emoji: string;
  date: string;
  time: string;
  userId: string;
}

export async function createDailyLogService({
  text,
  tags,
  emoji,
  date,
  time,
  userId,
}: CreateDailyLogRequest) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new Error('Perfil não encontrado');
  }

  const dailyLog = await prisma.dailyLog.create({
    data: {
      text,
      tags,
      emoji,
      date,
      time,
      profileId: profile.id,
    },
  });

  try {
    const hf = new HfInference(process.env.HF_API_KEY);
    
    const embeddingResponse = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });

    const embeddingArray = embeddingResponse as number[];
    const embeddingString = JSON.stringify(embeddingArray);

    await prisma.$executeRaw`UPDATE daily_logs SET embedding = ${embeddingString}::vector WHERE id = ${dailyLog.id}`;

  } catch (error) {
    console.error("Erro ao gerar ou salvar embedding para o DailyLog:", error);
    
  }

  return dailyLog;
}

export async function deleteDailyLogService(id: string, userId: string) {
  const dailyLog = await prisma.dailyLog.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!dailyLog) {
    throw new Error('Registro não encontrado ou não pertence a este usuário.');
  }

  return await prisma.dailyLog.delete({
    where: { id },
  });
}

export async function listDailyLogsService(
  userId: string
) {
  const dailyLogs = await prisma.dailyLog.findMany({
    where: {
      profile: {
        userId,
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return dailyLogs;
}
