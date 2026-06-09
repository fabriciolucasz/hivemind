import { prisma } from '../database/prisma';
import type {
  CreateVocationalTestRequest,
  VocationalAreaScore,
  VocationalTestAnswerInput,
  VocationalTestResult,
} from '../models/vocationalTestModel';

const vocationalAreas = [
  { area: 'relational', label: 'Perfil relacional e acolhedor' },
  { area: 'analytical', label: 'Perfil analítico e investigativo' },
  { area: 'practical', label: 'Perfil prático e operacional' },
  { area: 'organized', label: 'Perfil organizado e previsivel' },
];

const questionAreaMap: Record<string, string> = {
  '0': 'relational',
  '1': 'analytical',
  '2': 'practical',
  '3': 'relational',
  '4': 'organized',
  '5': 'practical',
  '6': 'relational',
  '7': 'analytical',
  '8': 'practical',
  '9': 'relational',
  '10': 'analytical',
  '11': 'practical',
  '12': 'relational',
  '13': 'analytical',
  '14': 'practical',
  '15': 'relational',
  '16': 'analytical',
  '17': 'practical',
  '18': 'relational',
  '19': 'analytical',
  '20': 'practical',
  '21': 'relational',
  '22': 'analytical',
  '23': 'practical',
  '24': 'relational',
  '25': 'analytical',
  '26': 'organized',
  '27': 'relational',
  '28': 'analytical',
  '29': 'practical',
};

function calculateResult(
  answers: VocationalTestAnswerInput[]
): VocationalTestResult {
  const totals = vocationalAreas.reduce<Record<string, number>>((acc, area) => {
    acc[area.area] = 0;
    return acc;
  }, {});

  answers.forEach((answer) => {
    const area = questionAreaMap[answer.questionId];

    if (area) {
      totals[area] += answer.answer;
    }
  });

  const scores: VocationalAreaScore[] = vocationalAreas
    .map((area) => {
      const areaQuestionCount = Object.values(questionAreaMap).filter(
        (mappedArea) => mappedArea === area.area
      ).length;
      const maxScore = Math.max(areaQuestionCount * 5, 1);

      return {
        ...area,
        score: totals[area.area],
        percentage: Math.round((totals[area.area] / maxScore) * 100),
      };
    })
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
