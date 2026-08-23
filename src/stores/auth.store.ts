import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { cookieStorage } from '@/lib';
import type { AuthUser, Tokens } from '@/lib/api/types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isAuthInitialized: boolean;

  setTokens: (tokens: Tokens) => void;
  setUser: (user: AuthUser) => void;
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

        // Login returns tokens only. The identity arrives separately from
        // /auth/me, so the store fills in two steps.
        setTokens: tokens => {
          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isLoggedIn: true,
          });
        },

        setUser: user => {
          set({ user });
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
