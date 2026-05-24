export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  interests?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  email: string;
}