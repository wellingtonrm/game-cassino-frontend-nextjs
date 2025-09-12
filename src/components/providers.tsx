'use client';

import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, web3QueryClient } from '@/web3/config/web3Config';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { queryClient } from '@/queries/react-query';
import { Toaster } from './ui/sonner';

// Create a component to handle network status
const NetworkStatusHandler = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show a toast notification when offline
  useEffect(() => {
    if (!isOnline) {
      // In a real implementation, you would show a toast here
      console.log('Você está offline. Algumas funcionalidades podem estar limitadas.');
    }
  }, [isOnline]);

  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={web3QueryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#fdbf5c',
            accentColorForeground: '#121214',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <NetworkStatusHandler />
          {children}
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}