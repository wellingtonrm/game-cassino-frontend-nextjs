import { create } from 'zustand'

interface WalletState {
  balance: number
  isLoading: boolean
  setBalance: (balance: number) => void
  setLoading: (loading: boolean) => void
  addToBalance: (amount: number) => void
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setLoading: (isLoading) => set({ isLoading }),
  addToBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
}))