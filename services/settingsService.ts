
import { UserTier } from "../types";

const STORAGE_KEY = 'coredna2_settings';

export interface AppSettings {
  apiKey?: string;
  theme: 'dark' | 'light' | 'system';
  notifications: boolean;
  userTier: UserTier;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  notifications: true,
  userTier: 'free'
};

export const saveSettings = (settings: Partial<AppSettings>) => {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const getStoredApiKey = (): string | undefined => {
  return process.env.API_KEY; // Always prefer env var, but logic kept for extensibility
};
