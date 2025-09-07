import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Web3WalletState, Web3WalletActions, Web3Session, PendingTransaction } from '@/types'

interface Web3WalletStore extends Web3WalletState, Web3WalletActions {
  pendingTransactions: PendingTransaction[]
  session: Web3Session | null
}

const initialState: Web3WalletState = {
  address: null,
  isConnected: false,
  chainId: null,
  isLoading: false,
  error: null,
  maticBalance: '0',
  usdtBalance: '0',
  ensName: null,
  connector: null,
}

export const useWeb3WalletStore = create<Web3WalletStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      pendingTransactions: [],
      session: null,

      setConnected: (address: string, chainId: number, connector: string) => {
        const session: Web3Session = {
          address,
          chainId,
          maticBalance: get().maticBalance,
          usdtBalance: get().usdtBalance,
          connectedAt: Date.now(),
          lastUpdated: Date.now(),
          connector,
        }

        set({
          address,
          chainId,
          connector,
          isConnected: true,
          isLoading: false,
          error: null,
          session,
        })
      },

      setDisconnected: () => {
        set({
          ...initialState,
          pendingTransactions: [],
          session: null,
        })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false })
      },

      setMaticBalance: (maticBalance: string) => {
        const state = get()
        const updatedSession = state.session ? {
          ...state.session,
          maticBalance,
          lastUpdated: Date.now(),
        } : null

        set({ 
          maticBalance, 
          session: updatedSession 
        })
      },

      setUSDTBalance: (usdtBalance: string) => {
        const state = get()
        const updatedSession = state.session ? {
          ...state.session,
          usdtBalance,
          lastUpdated: Date.now(),
        } : null

        set({ 
          usdtBalance, 
          session: updatedSession 
        })
      },

      setEnsName: (ensName: string | null) => {
        set({ ensName })
      },

      updateSession: () => {
        const state = get()
        if (state.session) {
          set({
            session: {
              ...state.session,
              lastUpdated: Date.now(),
              maticBalance: state.maticBalance,
              usdtBalance: state.usdtBalance,
            }
          })
        }
      },

      addPendingTransaction: (tx: PendingTransaction) => {
        const state = get()
        set({
          pendingTransactions: [tx, ...state.pendingTransactions]
        })
      },

      removePendingTransaction: (hash: string) => {
        const state = get()
        set({
          pendingTransactions: state.pendingTransactions.filter(tx => tx.hash !== hash)
        })
      },
    }),
    {
      name: 'web3-wallet-storage',
      partialize: (state) => ({
        session: state.session,
        pendingTransactions: state.pendingTransactions,
      }),
    }
  )
)