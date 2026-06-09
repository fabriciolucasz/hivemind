import { getStoredToken } from '../utils/authStorage';
import type {
  Profile,
  UpdateProfileData,
} from '../types/profile';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Erro inesperado' }));

    throw new Error(error.message ?? 'Erro inesperado');
  }

  return response.json();
}

function authHeaders() {
  const token = getStoredToken();

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProfile(): Promise<Profile> {
  const response = await fetch(`${API_URL}/api/profile`, {
    headers: authHeaders(),
  });

  return handleResponse<Profile>(response);
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<Profile> {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Profile>(response);
}

export async function deleteAccount(): Promise<void> {
  const response = await fetch(`${API_URL}/api/profile`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'Erro inesperado' }));

    throw new Error(error.message ?? 'Erro inesperado');
  }
}
