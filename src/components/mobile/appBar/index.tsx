"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import WalletDrawer from './walletDrawer';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { useAccount } from 'wagmi';

interface AppBarProps {
  className?: string;
  isBackButtonVisible?: boolean;
  onBack?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ 
  className,
  isBackButtonVisible = false,
  onBack
}) => {
     const { address  } = useAccount()
    const {balances} = useWeb3Wallet()
    const { state: { isAuthenticated, isLoading }, authenticate } = useAuth()
    // Calculate total USD value from individual balances
    const totalUSDValue = (balances?.matic?.usdValue !== undefined ? parseFloat(balances.matic.usdValue.toString()) : 0) + 
                          (balances?.usdt?.usdValue !== undefined ? parseFloat(balances.usdt.usdValue.toString()) : 0);
    
    // Provide default network name
    const networkName = 'Polygon';

  

  return (
    <>
      <header className={cn(
        "backdrop-blur-lg px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50",
        className
      )}>
        {/* Logo e Botão de Voltar */}
        <div className="flex items-center gap-3">
          {isBackButtonVisible && (
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
          )}
          <Logo />
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Wallet Icon Button */}
          {isAuthenticated ? (
           <WalletDrawer /> 
          ):(
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                onClick={openConnectModal}
                className="w-full bg-gradient-to-r  from-[#FF970F] to-[#DE041A] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold py-2 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#fdbf5c]/25 flex items-center"
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
          )}
        </div>
      </header>
      
      
    </>
  );
};

export default AppBar;