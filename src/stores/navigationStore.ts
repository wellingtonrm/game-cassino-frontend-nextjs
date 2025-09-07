import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NavigationTab = 'home' | 'casino' | 'sports' | 'profile' | 'wallet'

interface NavigationState {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
  isDrawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  isPageLoading: boolean
  setPageLoading: (loading: boolean) => void
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      activeTab: 'home', // Default to home
      setActiveTab: (tab: NavigationTab) => set({ activeTab: tab }),
      isDrawerOpen: false,
      setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
      isPageLoading: true, // Inicialmente, a página está carregando
      setPageLoading: (loading: boolean) => set({ isPageLoading: loading }),
    }),
    {
      name: 'navigation-storage', // nome para o storage
    }
  )
)