import {
  createContext,
  useContext,
  useState,
} from 'react';

import type { User } from '../types/user';
import {
  clearStoredAuth,
  getStoredUser,
  storeAuth,
} from '../utils/authStorage';

interface AuthContextData {
  user: User | null;

  signIn: (
    token: string,
    user: User
  ) => void;

  signOut: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [user, setUser] =
    useState<User | null>(() => getStoredUser());

  const signIn = (
    token: string,
    userData: User
  ) => {

    storeAuth(token, userData);
    setUser(userData);

  };

  const signOut = () => {

    clearStoredAuth();
    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {

  return useContext(AuthContext);

}
