'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { state, authenticate, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading } = state;

  const handleAuthentication = async () => {
    try {
      setError(null);
      await authenticate();
    } catch (err) {
      setError('Erro na autenticação. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    disconnect();
  };

  if (!isConnected) {
    return (
      <Card className="p-6 bg-[#121214] border-[#1A2040]">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold text-white">Conectar Sua Carteira</h2>
          <p className="text-gray-300 text-center">
            Conecte sua carteira para acessar sua conta e começar a jogar
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                onClick={openConnectModal}
                className="bg-[#fdbf5c] hover:bg-[#f69a0b] text-[#121214] px-6 py-3 rounded-lg font-medium"
              >
                Conectar Carteira
              </Button>
            )}
          </ConnectButton.Custom>
        </div>
      </Card>
    );
  }

  // Só mostra a carteira se estiver conectada E autenticada
  if (!isAuthenticated) {
    return (
      <Card className="p-6 bg-[#121214] border-[#1A2040]">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-orange-500 font-medium">Carteira Conectada</span>
          </div>
          
          <div className="text-center">
            <p className="text-gray-300 text-sm">Endereço da Carteira</p>
            <p className="text-white font-mono text-sm mt-1">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          
          <div className="w-full space-y-3">
            {error && (
              <div className="p-2 bg-[#9b0800]/50 border border-[#d43a00] rounded-lg">
                <p className="text-[#fdbf5c] text-xs flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </p>
              </div>
            )}
            
            <Button
              onClick={handleAuthentication}
              disabled={isLoading}
              className="w-full bg-[#fdbf5c] hover:bg-[#f69a0b] text-[#121214] font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Autenticar Carteira'
              )}
            </Button>
            
            <p className="text-gray-400 text-xs text-center">
              Você precisa assinar uma mensagem para provar a posse da carteira
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Carteira conectada E autenticada - mostra a interface completa
  return (
    <Card className="p-6 bg-[#121214] border-[#1A2040]">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-green-500 font-medium">Carteira Autenticada</span>
        </div>
        
        <div className="text-center">
          <p className="text-gray-300 text-sm">Endereço da Carteira</p>
          <p className="text-white font-mono text-sm mt-1">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        
        <Button
          onClick={handleLogout}
          disabled={isLoading}
          variant="destructive"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Desconectando...
            </>
          ) : (
            'Desconectar'
          )}
        </Button>
      </div>
    </Card>
  );
}