import { create } from 'zustand';

const storageKey = 'vite-ui-theme';

export const useUIStore = create((set) => ({
  theme: typeof window !== 'undefined' ? localStorage.getItem(storageKey) || 'system' : 'system',
  setTheme: (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    set({ theme: newTheme });
  },
})); 