import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { cookieStorage } from '@/lib';

export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isAuthInitialized: boolean;

  login: (data: AuthData) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoggedIn: false,
        isAuthInitialized: false,

        login: data => {
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            isLoggedIn: true,
          });
        },

        updateTokens: (accessToken, refreshToken) => {
          set({ accessToken, refreshToken });
        },

        logout: () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoggedIn: false,
          });
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => cookieStorage),
        onRehydrateStorage: () => state => {
          if (!state) return;
          state.isAuthInitialized = true;
        },
      }
    )
  )
);
