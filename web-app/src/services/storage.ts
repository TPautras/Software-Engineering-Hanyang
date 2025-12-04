import { User, Medication } from '../types';

const KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  MEDICATIONS: 'medications',
};

export const StorageService = {
  setAuthToken(token: string): void {
    localStorage.setItem(KEYS.AUTH_TOKEN, token);
  },

  getAuthToken(): string | null {
    return localStorage.getItem(KEYS.AUTH_TOKEN);
  },

  removeAuthToken(): void {
    localStorage.removeItem(KEYS.AUTH_TOKEN);
  },

  setUserData(user: User): void {
    localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
  },

  getUserData(): User | null {
    const data = localStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  removeUserData(): void {
    localStorage.removeItem(KEYS.USER_DATA);
  },

  setMedications(medications: Medication[]): void {
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(medications));
  },

  getMedications(): Medication[] {
    const data = localStorage.getItem(KEYS.MEDICATIONS);
    return data ? JSON.parse(data) : [];
  },

  clearAll(): void {
    localStorage.clear();
  },
};

export default StorageService;
