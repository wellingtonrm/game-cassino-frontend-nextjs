'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, web3QueryClient } from '@/web3/config/web3Config';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { queryClient } from '@/queries/react-query';
import { Toaster } from './ui/sonner';

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
          {children}
          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}