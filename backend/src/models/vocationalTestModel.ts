export interface VocationalTestAnswerInput {
  questionId: string;
  answer: number;
}

export interface CreateVocationalTestRequest {
  userId: string;
  answers: VocationalTestAnswerInput[];
}

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
