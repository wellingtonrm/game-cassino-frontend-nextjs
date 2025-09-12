"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import WalletDrawer from './walletDrawer';
import { useAccountWallet } from '@/hooks/useAccountWallet';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet } from 'lucide-react';

interface AppBarProps {
  className?: string;
}

const AppBar: React.FC<AppBarProps> = ({ 
  className 
}) => {
  const { hasWalletSession } = useAccountWallet();

  return (
    <>
      <header className={cn(
        "backdrop-blur-lg px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50 border-b border-[#1A2040]",
        className
      )}>
        {/* Logo */}
        <Logo />
        
        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Wallet Icon Button */}
          {hasWalletSession() ? (
           <WalletDrawer /> 
          ):(
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                onClick={openConnectModal}
                className="w-full bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold py-2 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#fdbf5c]/25 flex items-center"
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