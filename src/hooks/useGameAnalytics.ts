import { useEffect, useRef } from 'react';
import { useRecordGameResult, useStartSession, useEndSession } from '@/queries/analytics';
import { useAuthStore } from '@/stores/authStore';
import { useSessionStore } from '@/stores/sessionStore';

interface GameResult {
  gameType: string;
  betAmount: number;
  payout: number;
  multiplier: number;
  outcome: 'win' | 'loss';
  riskLevel: 'low' | 'medium' | 'high';
}

export const useGameAnalytics = () => {
  const { address } = useAuthStore();
  const { sessionId, isActive, startSession, endSession } = useSessionStore();
  const { mutate: recordGameResult } = useRecordGameResult();
  const { mutate: startSessionMutation } = useStartSession();
  const { mutate: endSessionMutation } = useEndSession();
  
  // Ref to track if session has been started
  const sessionStarted = useRef(false);

  // Start session when user authenticates
  useEffect(() => {
    if (address && !sessionStarted.current && !isActive) {
      startSessionMutation(address, {
        onSuccess: (data) => {
          if (data.sessionId) {
            startSession(data.sessionId);
            sessionStarted.current = true;
          }
        }
      });
    }
  }, [address, isActive, startSession, startSessionMutation]);

  // Record game result
  const trackGameResult = (result: GameResult) => {
    if (!address || !sessionId) return;
    
    recordGameResult({
      playerId: address,
      gameData: result
    });
  };

  // End session
  const endGameSession = () => {
    if (sessionId) {
      endSessionMutation(sessionId, {
        onSuccess: () => {
          endSession();
          sessionStarted.current = false;
        }
      });
    }
  };

  return {
    trackGameResult,
    endGameSession,
    sessionId,
    isActive
  };
};