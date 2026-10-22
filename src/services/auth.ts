import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppUser } from '@/types/user';
import { createId } from '@/utils/id';
import { readJsonArray } from '@/utils/storage';

export interface AuthService {
  getCurrentUser(): Promise<AppUser | null>;
  signIn(email: string, password: string): Promise<AppUser>;
  signUp(name: string, email: string, password: string): Promise<AppUser>;
  signOut(): Promise<void>;
}

export class AuthError extends Error {}

const USERS_KEY = '@gostoescolar/users';
const SESSION_KEY = '@gostoescolar/session';

type StoredUser = AppUser & { passwordHash: string };

// Local development only: not a secure password hash. Replace with a real backend (Firebase/Supabase).
function weakHash(value: string) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readUsers() {
  return readJsonArray<StoredUser>(USERS_KEY);
}

function toPublicUser({ id, name, email }: StoredUser): AppUser {
  return { id, name, email };
}

const localAuthService: AuthService = {
  async getCurrentUser() {
    const userId = await AsyncStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    const user = (await readUsers()).find((u) => u.id === userId);
    return user ? toPublicUser(user) : null;
  },

  async signIn(email, password) {
    const users = await readUsers();
    const user = users.find((u) => u.email === normalizeEmail(email));
    if (!user || user.passwordHash !== weakHash(password)) {
      throw new AuthError('E-mail ou senha inválidos.');
    }
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return toPublicUser(user);
  },

  async signUp(name, email, password) {
    const users = await readUsers();
    const normalized = normalizeEmail(email);
    if (users.some((u) => u.email === normalized)) {
      throw new AuthError('Já existe uma conta com este e-mail.');
    }
    const user: StoredUser = {
      id: createId(),
      name: name.trim(),
      email: normalized,
      passwordHash: weakHash(password),
    };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return toPublicUser(user);
  },

  async signOut() {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};

export const authService: AuthService = localAuthService;
