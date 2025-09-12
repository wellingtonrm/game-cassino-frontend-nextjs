import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from '@/services/analytics';

// Session management hooks
export const useStartSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (playerId: string) => analyticsApi.startSession(playerId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useEndSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => analyticsApi.endSession(sessionId),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

// Game result tracking hook
export const useRecordGameResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (params: { playerId: string; gameData: any }) => 
      analyticsApi.recordGameResult(params.playerId, params.gameData),
    onSuccess: (_, variables) => {
      // Invalidate statistics for this player
      queryClient.invalidateQueries({ queryKey: ['player-statistics', variables.playerId] });
      queryClient.invalidateQueries({ queryKey: ['risk-analysis', variables.playerId] });
    },
  });
};

// Player statistics hook
export const usePlayerStatistics = (playerId: string, gameType?: string) => {
  return useQuery({
    queryKey: ['player-statistics', playerId, gameType],
    queryFn: () => analyticsApi.getPlayerStatistics(playerId, gameType),
    enabled: !!playerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Risk analysis hook
export const useRiskAnalysis = (playerId: string, limit?: number) => {
  return useQuery({
    queryKey: ['risk-analysis', playerId, limit],
    queryFn: () => analyticsApi.getRiskAnalysis(playerId, limit),
    enabled: !!playerId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Session data hook
export const useSessionData = (sessionId: string) => {
  return useQuery({
    queryKey: ['session-data', sessionId],
    queryFn: () => analyticsApi.getSessionData(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};