import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

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
    useState<User | null>(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        '@hivemind:user'
      );

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  const signIn = (
    token: string,
    userData: User
  ) => {

    localStorage.setItem(
      '@hivemind:token',
      token
    );

    localStorage.setItem(
      '@hivemind:user',
      JSON.stringify(userData)
    );

    setUser(userData);

  };

  const signOut = () => {

    localStorage.removeItem(
      '@hivemind:token'
    );

    localStorage.removeItem(
      '@hivemind:user'
    );

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