import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  address: string | null;
  nonce: string | null;
  setAuthenticated: (token: string, address: string) => void;
  setNonce: (nonce: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      address: null,
      nonce: null,
      setAuthenticated: (token, address) => set({ isAuthenticated: true, token, address }),
      setNonce: (nonce) => set({ nonce }),
      logout: () => set({ isAuthenticated: false, token: null, address: null, nonce: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);