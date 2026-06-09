export interface VocationalAreaScore {
  area: string;
  label: string;
  score: number;
  percentage: number;
}

export interface VocationalTestResult {
  primaryArea: string;
  primaryLabel: string;
  scores: VocationalAreaScore[];
}

export interface VocationalTestType {
  id: string;
  name: string;
  date: string;
  status: 'completed';
  totalQuestions: number;
  answers: number[];
  result: VocationalTestResult | null;
}

export interface CreateVocationalTestData {
  userId: string;
  answers: Array<{
    questionId: string;
    answer: number;
  }>;
}
