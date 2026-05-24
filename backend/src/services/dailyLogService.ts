import { prisma } from '../database/prisma';

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

  return dailyLog;
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
