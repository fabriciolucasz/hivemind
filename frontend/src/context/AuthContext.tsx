import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('@hivemind:user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@hivemind:token');
  });

  function signIn(token: string, user: User) {
    localStorage.setItem('@hivemind:token', token);
    localStorage.setItem('@hivemind:user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@hivemind:token');
    localStorage.removeItem('@hivemind:user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}