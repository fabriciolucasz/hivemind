export interface RecommendedCourse {
  courseName: string;
  affinity: number;
  reason: string;
}

export interface RecommendationSuccess {
  status: 'success';
  recommendations: RecommendedCourse[];
}

export interface RecommendationInsufficientData {
  status: 'insufficient_data';
  message: string;
  requiredActions: string[];
}

export type RecommendationResponse =
  | RecommendationSuccess
  | RecommendationInsufficientData;

