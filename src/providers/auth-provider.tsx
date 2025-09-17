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
  const {
    data: nonceResponse,
    isLoading: isNonceLoading
  } = useNonceQuery(address || '');
  const { signMessageAsync, isPending: isSigning } = useSignMessage();
  const { mutateAsync: loginMutationAsync, isPending: isLoggingIn } = useLogin();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    address: null,
    isLoading: false,
    isConnecting: false
  });


  const isVerefildAddressCookies = useCallback((address?: string): boolean => {
    const savedAddress = Cookies.get('wallet_address');
    return savedAddress ? address === savedAddress : false;
  }, []);

  const isVefildAccessTokenCookies = useCallback((): boolean => {
    const savedAccessToken = Cookies.get('wallet_acessToken');
    return savedAccessToken ? true : false;
  }, []);

  // useEffect 1: Gerenciar estado da wallet (conectar/desconectar)
  useEffect(() => {
    if (!address || !isConnected) {
      console.log('Wallet desconectada, limpando estado de autenticação');
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        address: null
      }));
    }
  }, [address, isConnected]);

  // useEffect 2: Verificar e restaurar sessão dos cookies (apenas quando wallet conecta)
  useEffect(() => {
    if (!address || !isConnected) return;

    // Verificar se há sessão válida nos cookies para este endereço
    const hasValidSession = isVerefildAddressCookies(address) && isVefildAccessTokenCookies();
    
    if (hasValidSession) {
      console.log('Restaurando sessão autenticada dos cookies para:', address);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        address: address
      }));
    } else {
      console.log('Nenhuma sessão válida encontrada nos cookies');
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        address: address // Manter o endereço mas não autenticado
      }));
    }
  }, [address]); // Só executa quando o endereço muda

  // Função para autenticar (conectar wallet + assinar + login)
  const authenticate = async () => {
    if (!address || !isConnected || !nonceResponse?.data?.nonce) {
      console.log('Wallet não conectada ou nonce não disponível');
      return;
    }

    // Verificar se já está autenticado para esta carteira
    if (authState.isAuthenticated && authState.address === address) {
      console.log('Usuário já autenticado para esta carteira');
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, isConnecting: true }));

      console.log('Solicitando assinatura para carteira:', address);
      
      // 1. Assinar o nonce - força assinatura para todas as carteiras
      const signature = await signMessageAsync({ message: nonceResponse.data.nonce });

      console.log('Assinatura obtida, realizando login...');

      // 2. Enviar assinatura para login
      const resultlogin = await loginMutationAsync({
        signature: signature,
        address: address,
      }, {
        onSuccess: (response) => {
          console.log('Login bem-sucedido:', response)
          // 3. Atualizar estado após login bem-sucedido
          setAuthState({
            isAuthenticated: true,
            address: address,
            isLoading: false,
            isConnecting: false
          });

          // Salvar nos cookies (tokens são gerenciados automaticamente via cookies HTTP)
          Cookies.set('wallet_acessToken', response.data.accessToken, { expires: 7 });
          Cookies.set('wallet_address', address, { expires: 7 });
          console.log('Login realizado com sucesso para carteira:', address);
        },
        onError: (error) => {
          console.error('Erro no login:', error);
          setAuthState(prev => ({ ...prev, isConnecting: false }));
        }
      });

    } catch (error) {
      console.error('Erro na autenticação:', error);
      setAuthState(prev => ({ ...prev, isConnecting: false }));
      
      // Se o usuário rejeitou a assinatura, mostrar mensagem específica
      if (error instanceof Error && error.message.includes('User rejected')) {
        console.log('Usuário rejeitou a assinatura');
      }
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
    Cookies.remove('wallet_address');
    Cookies.remove('wallet_acessToken');
  }, []);

  // useEffect 3: Auto-autenticar apenas quando necessário (sem sessão válida)
  useEffect(() => {
    // Condições para iniciar autenticação:
    // 1. Tem nonce disponível
    // 2. Wallet está conectada
    // 3. NÃO está autenticado
    // 4. NÃO está no processo de conexão
    // 5. Endereço está definido no estado mas não autenticado
    const shouldAuthenticate = nonceResponse?.data.nonce && 
        address && 
        isConnected && 
        !authState.isAuthenticated && 
        !authState.isConnecting &&
        authState.address === address; // Só autentica se o endereço já foi processado

    if (shouldAuthenticate) {
      console.log('Iniciando processo de autenticação para:', address);
      authenticate();
    }
  }, [nonceResponse?.data.nonce, address, isConnected, authState.isAuthenticated, authState.isConnecting, authState.address]);

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

