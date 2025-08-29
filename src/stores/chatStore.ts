import { create } from 'zustand';

interface ChatState {
  isVisible: boolean;
  toggleVisibility: () => void;
  setVisibility: (visible: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isVisible: true,
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setVisibility: (visible: boolean) => set({ isVisible: visible }),
}));