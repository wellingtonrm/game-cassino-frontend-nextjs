import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

interface NonceResponse {
  nonce?: string;
}
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

/**
 * Hook to get nonce for wallet authentication
 */
export const useNonceQuery = (address: string) => {
  return useQuery({
    queryKey: ['nonce-address', address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
     const {data} = await  api.get<ApiResponse<NonceResponse>>(`/auth/nonce/${address}`);
    return data ;
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
  return useMutation({
    mutationFn: async (
      { signature, address }: { signature: string; address: string }) => {
      const {data} = await api.post<ApiResponse<AuthResponse>>('/auth/login', { signature, address });
      return data;
    },
    onSuccess: (data, variables) => {
      // Update authentication state (tokens are handled by cookies)
     // setAuthenticated(variables.address);

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

/**
 * Hook to refresh access token
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/refresh'),
    onSuccess: () => {
      // Tokens are handled by cookies, just invalidate queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

/**
 * Hook to logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};