import { useCallback, useEffect, useState } from 'react';

import {
  deleteAccount,
  getProfile,
  updateProfile,
} from '../services/profileService';
import type {
  Profile,
  UpdateProfileData,
} from '../types/profile';

interface UseProfileOptions {
  onUnauthorized?: () => void;
}

function isUnauthorizedError(error: unknown) {
  return (
    error instanceof Error &&
    ['Token inválido', 'Token não informado'].includes(error.message)
  );
}

export function useProfile(options: UseProfileOptions = {}) {
  const { onUnauthorized } = options;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const data = await getProfile();
      setProfile(data);
    } catch (loadError) {
      console.error('Erro ao carregar perfil:', loadError);

      if (isUnauthorizedError(loadError)) {
        onUnauthorized?.();
        return;
      }

      setError('Não foi possível carregar o perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const editProfile = useCallback(async (data: UpdateProfileData) => {
    const updatedProfile = await updateProfile(data);
    setProfile(updatedProfile);

    return updatedProfile;
  }, []);

  const removeAccount = useCallback(async () => {
    await deleteAccount();
    setProfile(null);
  }, []);

  return {
    profile,
    isLoading,
    error,
    setError,
    editProfile,
    removeAccount,
    reloadProfile: loadProfile,
  };
}
