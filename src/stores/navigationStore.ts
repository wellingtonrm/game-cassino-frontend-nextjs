import { create } from 'zustand'

export type NavigationTab = 'home' | 'casino' | 'sports' | 'profile' | 'wallet'

interface NavigationState {
  activeTab: NavigationTab
  setActiveTab: (tab: NavigationTab) => void
  isDrawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  activeTab: 'home', // Default to casino since we're on the Plinko page
  setActiveTab: (tab: NavigationTab) => set({ activeTab: tab }),
  isDrawerOpen: false,
  setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),
}))