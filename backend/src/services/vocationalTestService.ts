import { prisma } from '../database/prisma';
import type {
  CreateVocationalTestRequest,
  VocationalAreaScore,
  VocationalTestAnswerInput,
  VocationalTestResult,
} from '../models/vocationalTestModel';

const vocationalAreas = [
  { area: 'logical', label: 'Raciocinio logico e tecnologia' },
  { area: 'creative', label: 'Criatividade e expressao' },
  { area: 'social', label: 'Humanas e cuidado com pessoas' },
  { area: 'scientific', label: 'Ciencias e investigacao' },
  { area: 'practical', label: 'Acao pratica e performance' },
];

function calculateResult(
  answers: VocationalTestAnswerInput[]
): VocationalTestResult {
  const totals = vocationalAreas.reduce<Record<string, number>>((acc, area) => {
    acc[area.area] = 0;
    return acc;
  }, {});

  answers.forEach((answer) => {
    const area = vocationalAreas[answer.answer];

    if (area) {
      totals[area.area] += 1;
    }
  });

  const maxScore = Math.max(answers.length, 1);

  const scores: VocationalAreaScore[] = vocationalAreas
    .map((area) => ({
      ...area,
      score: totals[area.area],
      percentage: Math.round((totals[area.area] / maxScore) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  const primary = scores[0];

  return {
    primaryArea: primary.area,
    primaryLabel: primary.label,
    scores,
  };
}

async function findProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error('Perfil nao encontrado');
  }

  return profile;
}

export async function listVocationalTestsService(userId: string) {
  if (!userId) {
    throw new Error('Usuario nao informado');
  }

  return prisma.vocationalTest.findMany({
    where: {
      profile: {
        userId,
      },
    },
    include: {
      answers: true,
    },
    orderBy: {
      realizedAt: 'desc',
    },
  });
}

export async function createVocationalTestService({
  userId,
  answers,
}: CreateVocationalTestRequest) {
  if (!userId) {
    throw new Error('Usuario nao informado');
  }

  if (!answers.length) {
    throw new Error('Respostas nao informadas');
  }

  const profile = await findProfileByUserId(userId);
  const result = calculateResult(answers);

  return prisma.vocationalTest.create({
    data: {
      name: 'Teste Vocacional',
      result: JSON.stringify(result),
      profileId: profile.id,
      answers: {
        create: answers.map((answer) => ({
          questionId: answer.questionId,
          answer: String(answer.answer),
        })),
      },
    },
    include: {
      answers: true,
    },
  });
}

export async function deleteVocationalTestService(
  id: string,
  userId: string
) {
  if (!id || !userId) {
    throw new Error('Teste ou usuario nao informado');
  }

  const test = await prisma.vocationalTest.findFirst({
    where: {
      id,
      profile: {
        userId,
      },
    },
  });

  if (!test) {
    throw new Error('Teste vocacional nao encontrado');
  }

  await prisma.testAnswer.deleteMany({
    where: {
      vocationalTestId: id,
    },
  });

  await prisma.vocationalTest.delete({
    where: {
      id,
    },
  });
}
