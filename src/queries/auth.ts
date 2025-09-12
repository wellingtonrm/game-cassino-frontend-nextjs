import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook to get nonce for wallet authentication
 */
export const useNonce = (address: string | undefined) => {
  return useQuery({
    queryKey: ['nonce', address],
    queryFn: () => {
      if (!address) throw new Error('Address is required');
      return authApi.getNonce(address);
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to login with wallet signature
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  
  return useMutation({
    mutationFn: ({ address, signature }: { address: string; signature: string }) => 
      authApi.login(address, signature),
    onSuccess: (data, variables) => {
      // Store the JWT token and address
      setAuthenticated(data.token, variables.address);
      
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};