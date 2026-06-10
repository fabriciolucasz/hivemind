import { api } from './api';
import type {
  Profile,
  UpdateProfileData,
} from '../types/profile';

export async function getProfile(): Promise<Profile> {
  const response = await api.get('/api/profile');
  return response.data;
}

export async function updateProfile(
  data: UpdateProfileData
): Promise<Profile> {
  const response = await api.put('/api/profile', data);
  return response.data;
}

export async function deleteAccount(): Promise<void> {
  await api.delete('/api/profile');
}
