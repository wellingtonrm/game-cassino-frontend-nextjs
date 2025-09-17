'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, web3QueryClient } from '@/web3/config/web3Config';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { AuthProvider } from './auth-provider';
import { useWalletConnectFix } from '@/hooks/useWalletConnectFix';

function ProvidersInner({ children }: { children: React.ReactNode }) {
  // Aplica a correção do WalletConnect
  useWalletConnectFix();

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
          modalSize="compact"
          initialChain={137} // Polygon mainnet
          showRecentTransactions={true}
          coolMode={false}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProvidersInner>{children}</ProvidersInner>;
}