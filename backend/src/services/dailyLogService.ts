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
    // Extrai as features/embeddings do texto usando a API Gratuita da Hugging Face
    const embeddingResponse = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });

    const embeddingArray = embeddingResponse as number[];
    const embeddingString = JSON.stringify(embeddingArray);

    // Injeta o embedding no banco (Prisma precisa de SQL bruto para o formato Unsupported do pgvector)
    await prisma.$executeRaw`UPDATE daily_logs SET embedding = ${embeddingString}::vector WHERE id = ${dailyLog.id}`;

  } catch (error) {
    console.error("Erro ao gerar ou salvar embedding para o DailyLog:", error);
    // Não quebramos o fluxo principal caso o embedding falhe, apenas logamos
  }

  return dailyLog;
}

export async function deleteDailyLogService(id: string) {
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
