import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error) => {
        // Don't retry on network errors or when connection is interrupted
        if (error instanceof Error && 
            (error.message.includes('interrupted') || 
             error.message.includes('network') || 
             error.message.includes('WebSocket'))) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      networkMode: 'always',
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry on network errors
        if (error instanceof Error && 
            (error.message.includes('interrupted') || 
             error.message.includes('network') || 
             error.message.includes('WebSocket'))) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      }
    }
  },
})