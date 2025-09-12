import apiClient from './api';

export const analyticsApi = {
  // Session management
  startSession: async (playerId: string) => {
    const response = await apiClient.post('/analytics/session/start', { playerId });
    return response.data;
  },

  endSession: async (sessionId: string) => {
    const response = await apiClient.post('/analytics/session/end', { sessionId });
    return response.data;
  },

  // Game result tracking
  recordGameResult: async (playerId: string, gameData: {
    gameType: string;
    betAmount: number;
    payout: number;
    multiplier: number;
    outcome: string;
    riskLevel: string;
  }) => {
    const response = await apiClient.post('/analytics/game/result', { playerId, gameData });
    return response.data;
  },

  // Player statistics
  getPlayerStatistics: async (playerId: string, gameType?: string) => {
    const url = gameType 
      ? `/analytics/player/${playerId}/statistics?gameType=${gameType}`
      : `/analytics/player/${playerId}/statistics`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Risk analysis
  getRiskAnalysis: async (playerId: string, limit?: number) => {
    const url = limit 
      ? `/analytics/player/${playerId}/risk-analysis?limit=${limit}`
      : `/analytics/player/${playerId}/risk-analysis`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Session data
  getSessionData: async (sessionId: string) => {
    const response = await apiClient.get(`/analytics/session/${sessionId}`);
    return response.data;
  }
};