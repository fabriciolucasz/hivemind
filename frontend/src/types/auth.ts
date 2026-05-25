import type { User } from '../models/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  grade?: string;
  interests?: string;
}