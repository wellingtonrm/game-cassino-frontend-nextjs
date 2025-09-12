'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isAuthenticated, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    disconnect();
    logout();
    setIsLoggingOut(false);
  };

  if (!isConnected) {
    return (
      <Card className="p-6 bg-[#121214] border-[#1A2040]">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-300 text-center">
            Connect your wallet to access your account and start playing
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                onClick={openConnectModal}
                className="bg-[#fdbf5c] hover:bg-[#f69a0b] text-[#121214] px-6 py-3 rounded-lg font-medium"
              >
                Connect Wallet
              </Button>
            )}
          </ConnectButton.Custom>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-[#121214] border-[#1A2040]">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#fdbf5c] rounded-full"></div>
          <span className="text-[#fdbf5c] font-medium">Connected</span>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 text-sm">Wallet Address</p>
          <p className="text-white font-mono text-sm mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="w-full"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-[#1D2659] text-gray-300 hover:bg-[#1D2659]"
            disabled
          >
            Please sign in
          </Button>
        )}
      </div>
    </Card>
  );
}