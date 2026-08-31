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

  setSession: (tokens: Tokens, user: AuthUser) => void;
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

        setSession: (tokens, user) => {
          set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user,
            isLoggedIn: true,
          });
        },

        // /auth/me re-reads the same shape on every boot, so a role or
        // designation changed since login lands here without a re-login.
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
