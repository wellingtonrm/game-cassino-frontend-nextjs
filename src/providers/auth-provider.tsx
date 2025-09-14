import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useLogin, useNonceQuery } from '@/queries/auth';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  address: string | null;
  isLoading: boolean;
  isConnecting: boolean;
}

interface AuthContextType {
  state: AuthState;
  authenticate: () => Promise<void>;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { data: nonceResponse, isLoading: isNonceLoading } = useNonceQuery(address || '');
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { mutateAsync: loginMutationAsync, isPending: isLoggingIn } = useLogin();
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    address: null,
    isLoading: false,
    isConnecting: false
  });


  const isVerefildAddressCookies = (address?: string):boolean => {
     const savedAddress = Cookies.get('wallet_address');
    return savedAddress ? address === savedAddress : false;
  }
  const isVefildAccessTokenCookies = ():boolean => {
    const savedAccessToken = Cookies.get('wallet_acessToken');
    return savedAccessToken ? true : false;
  }

  // Inicializar estado a partir dos cookies
  useEffect(() => {
    if (isVerefildAddressCookies(address)) {
      if (isVefildAccessTokenCookies()) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          address: address!
        }));
      }
    }
  }, [address, isVerefildAddressCookies, isVefildAccessTokenCookies]);

  // Função para autenticar (conectar wallet + assinar + login)
  const authenticate = async () => {
    if (!address || !isConnected || !nonceResponse?.data?.nonce) {
      console.log('Wallet não conectada ou nonce não disponível');
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isConnecting: true }));
      
      // 1. Assinar o nonce
      const signature = await signMessageAsync({ message: nonceResponse.data.nonce });
      
      // 2. Enviar assinatura para login
      const resultlogin = await loginMutationAsync({
        signature: signature,
        address: address,
      }, {
        onSuccess: (response) => {
          console.log(response)
          // 3. Atualizar estado após login bem-sucedido
          setAuthState({
            isAuthenticated: true,
            address: address,
            isLoading: false,
            isConnecting: false
          });
          
          // Salvar nos cookies (tokens são gerenciados automaticamente via cookies HTTP)
          Cookies.set('wallet_acessToken',  resultlogin.data.accessToken, { expires: 7 });
          Cookies.set('wallet_address', address, { expires: 7 });
          console.log('Login realizado com sucesso');
        },
        onError: (error) => {
          console.error('Erro no login:', error);
          setAuthState(prev => ({ ...prev, isConnecting: false }));
        }
      });
      
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setAuthState(prev => ({ ...prev, isConnecting: false }));
    }
  }

  // Função de logout
  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      address: null,
      isLoading: false,
      isConnecting: false
    });
    
    // Limpar cookies
    Cookies.remove('access_token');
    Cookies.remove('wallet_address');
  }, []);

  // Auto-autenticar quando wallet conecta e nonce está disponível
  useEffect(() => {
    if (nonceResponse?.data.nonce) {
      authenticate();
    }
  }, [nonceResponse]);

  // Limpar estado quando wallet desconecta
  useEffect(() => {
    if (!isConnected) {
      logout();
    }
  }, [isConnected, logout]);

  const contextValue: AuthContextType = {
    state: {
      ...authState,
      isLoading: isNonceLoading || isSigning || isLoggingIn || authState.isConnecting
    },
    authenticate,
    logout,
    isReady: !!address && isConnected
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Hook para acessar apenas o estado
export function useAuthState() {
  const { state } = useAuth();
  return state;
}

// Hook para verificar se o usuário está autenticado
export function useIsAuthenticated() {
  const { state } = useAuth();
  return state.isAuthenticated;
}

// Hook para obter apenas o endereço da wallet
export function useWalletAddress() {
  const { state } = useAuth();
  return state.address;
}

