import type { User } from '../types/user';

const TOKEN_KEY = '@hivemind:token';
const USER_KEY = '@hivemind:user';
const SESSION_TIMESTAMP_KEY = '@hivemind:session_timestamp';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_KEY);
  const storedTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);

  if (!storedUser) {
    return null;
  }

  const isExpired = storedTimestamp
    ? Date.now() - parseInt(storedTimestamp, 10) > SESSION_TTL_MS
    : false;

  if (isExpired) {
    clearStoredAuth();
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function storeAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_TIMESTAMP_KEY);
}
