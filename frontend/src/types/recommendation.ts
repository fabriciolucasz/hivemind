export interface RecommendedCourse {
  courseName: string;
  affinity: number;
  reason: string;
}

export interface RecommendedMaterial {
  type: string;
  title: string;
  detail: string;
  level: string;
}

export interface RecommendationSuccess {
  status: 'success';
  recommendations: RecommendedCourse[];
  materials: RecommendedMaterial[];
  nextSteps: string[];
}

export interface RecommendationInsufficientData {
  status: 'insufficient_data';
  message: string;
  requiredActions: string[];
}

export type RecommendationResponse =
  | RecommendationSuccess
  | RecommendationInsufficientData;
