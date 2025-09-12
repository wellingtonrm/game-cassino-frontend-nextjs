import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  sessionId: string | null;
  isActive: boolean;
  startSession: (sessionId: string) => void;
  endSession: () => void;
  setSessionActive: (active: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      isActive: false,
      startSession: (sessionId) => set({ sessionId, isActive: true }),
      endSession: () => set({ sessionId: null, isActive: false }),
      setSessionActive: (active) => set({ isActive: active }),
    }),
    {
      name: 'session-storage',
    }
  )
);