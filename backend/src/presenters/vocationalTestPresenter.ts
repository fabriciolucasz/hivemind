import type { Prisma } from '@prisma/client';
import type { VocationalTestResult } from '../models/vocationalTestModel';

type VocationalTestWithAnswers = Prisma.VocationalTestGetPayload<{
  include: {
    answers: true;
  };
}>;

function parseResult(result: string): VocationalTestResult | null {
  try {
    return JSON.parse(result) as VocationalTestResult;
  } catch {
    return null;
  }
}

export function vocationalTestPresenter(test: VocationalTestWithAnswers) {
  return {
    id: test.id,
    name: test.name,
    date: test.realizedAt.toISOString(),
    status: 'completed',
    totalQuestions: test.answers.length,
    answers: test.answers
      .sort((a, b) => Number(a.questionId) - Number(b.questionId))
      .map((answer) => Number(answer.answer)),
    result: parseResult(test.result),
  };
}
