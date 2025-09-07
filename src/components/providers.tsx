'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme, DisclaimerComponent } from '@rainbow-me/rainbowkit'
import { queryClient } from '@/queries/react-query'
import { wagmiConfig } from '@/config/web3Config'

// Importa estilos do RainbowKit
import '@rainbow-me/rainbowkit/styles.css'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#6D28D9', // Cor principal - roxo vibrante
            accentColorForeground: '#FFFFFF',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'large'
          })}
          appInfo={{
            appName: 'Boominas Jogos Descentralizados - Maior do Brasil',
            learnMoreUrl: 'https://docs.raspadinha-casino.com',
            disclaimer: ({ Text, Link }) => (
              <Text>
                Conecte sua carteira para acessar todas as funcionalidades do jogo e gerenciar seus ativos de forma segura. Leia nossos{' '}
                <Link href="https://docs.raspadinha-casino.com/termos">termos de uso</Link>.
              </Text>
            ),
          }}
          modalSize="wide"
          showRecentTransactions={true}
        >
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}