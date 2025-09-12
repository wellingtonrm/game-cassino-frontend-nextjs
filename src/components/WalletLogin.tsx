'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNonce, useLogin } from '@/queries/auth';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function WalletLogin() {
  const { address, isConnected } = useAccount();
  const { isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  
  // Get nonce for the connected wallet
  const { data: nonceData, isLoading: isNonceLoading, isError: isNonceError } = useNonce(address);
  
  // Sign message hook
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  
  // Login mutation
  const { mutate: login, isPending: isLoggingIn, isError: isLoginError } = useLogin();
  
  const handleLogin = async () => {
    if (!address || !nonceData?.nonce) return;
    
    try {
      setError(null);
      
      // Sign the nonce message
      const signature = await signMessageAsync({ 
        message: nonceData.nonce 
      });
      
      // Login with the signature
      login({ address, signature });
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign message or login');
    }
  };
  
  // Show nothing if wallet is not connected or user is already authenticated
  if (!isConnected || isAuthenticated) {
    return null;
  }
  
  // Show loading state while fetching nonce
  if (isNonceLoading) {
    return (
      <Card className="p-6 bg-[#121214] border-[#1A2040]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#fdbf5c]" />
          <p className="text-gray-300">Preparing authentication...</p>
        </div>
      </Card>
    );
  }
  
  // Show error if nonce fetching failed
  if (isNonceError) {
    return (
      <Card className="p-6 bg-[#121214] border-[#1A2040]">
        <div className="flex flex-col items-center space-y-4">
          <AlertCircle className="h-8 w-8 text-[#d43a00]" />
          <p className="text-[#d43a00]">Failed to initialize authentication</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-[#1D2659] text-gray-300 hover:bg-[#1D2659]"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-[#121214] border-[#1A2040]">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Wallet Authentication</h2>
          <p className="text-gray-300 text-sm">
            Sign a message to prove ownership of your wallet
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-[#9b0800]/50 border border-[#d43a00] rounded-lg w-full">
            <p className="text-[#fdbf5c] text-sm text-center">{error}</p>
          </div>
        )}
        
        {isLoginError && (
          <div className="p-3 bg-[#9b0800]/50 border border-[#d43a00] rounded-lg w-full">
            <p className="text-[#fdbf5c] text-sm text-center">Authentication failed. Please try again.</p>
          </div>
        )}
        
        <Button
          onClick={handleLogin}
          disabled={isSigning || isLoggingIn}
          className="w-full bg-[#fdbf5c] hover:bg-[#f69a0b] text-[#121214] py-3 rounded-lg font-medium flex items-center justify-center"
        >
          {(isSigning || isLoggingIn) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSigning ? 'Signing...' : 'Authenticating...'}
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        <p className="text-gray-400 text-xs text-center mt-2">
          This will prompt your wallet to sign a message. No transactions will be made.
        </p>
      </div>
    </Card>
  );
}