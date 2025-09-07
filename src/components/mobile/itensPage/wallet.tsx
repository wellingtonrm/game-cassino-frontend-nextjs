'use client'

import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { useNavigationStore } from '@/stores/navigationStore'
import { 
  AlertTriangle, 
  Wallet, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ChevronDown,
  ChevronUp,
  CheckCircle, 
  XCircle,
  Bell,
  Settings,
  Scan,
  Send,
  ArrowUpDown
} from 'lucide-react'
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet'
import { useUSDTBalance } from '@/hooks/useUSDTBalance'
import { useSessionCookie } from '@/hooks/useSessionCookie'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Toggle } from '@/components/ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  formatAddress, 
  formatUSD, 
  getBlockExplorerAddressUrl, 
  getRelativeTime,
  getMockPrices 
} from '@/lib/web3Utils'

// Adicione estilos globais para tipografia Material Design

export default function WalletPage() {
  const [copied, setCopied] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [expandedTokens, setExpandedTokens] = useState<Record<string, boolean>>({})
  const [tokenToggles, setTokenToggles] = useState<Record<string, boolean>>({
    usdt: true,
    matic: true,
    eth: false,
    sol: false,
    trx: false,
    thorchain: false,
    dash: false
  })
  
  const { setPageLoading } = useNavigationStore()
  
  // Quando o componente é montado, definimos o loading como false
  useEffect(() => {
    // Simula um tempo de carregamento para os componentes
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 700) // 700ms de delay para simular carregamento
    
    return () => clearTimeout(timer)
  }, [setPageLoading])
  
  // Hooks Web3
  const { address } = useAccount()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Hooks customizados
  const {
    address: walletAddress,
    ensName,
    isConnected,
    chainId,
    connector,
    isLoading,
    error,
    isCorrectNetwork,
    balances,
    totalUSDValue,
    disconnect,
    refreshBalances,
    clearError,
    networkName,
    blockExplorerUrl,
  } = useWeb3Wallet()
  
  const usdtBalance = useUSDTBalance(address)
  const { saveSession, loadSession, hasValidSession, getSessionInfo } = useSessionCookie()
  
  // Estado da sessão
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  
  // Carrega informações da sessão ao montar
  useEffect(() => {
    const info = getSessionInfo()
    setSessionInfo(info)
  }, [getSessionInfo, isConnected])
  
  // Salva sessão quando conectar
  useEffect(() => {
    if (isConnected && walletAddress && chainId && connector) {
      saveSession({
        address: walletAddress,
        chainId,
        maticBalance: balances.matic.balance,
        usdtBalance: balances.usdt.balance,
        connectedAt: Date.now(),
        lastUpdated: Date.now(),
        connector,
      })
    }
  }, [isConnected, walletAddress, chainId, connector, balances, saveSession])
  
  // Função para copiar endereço
  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  // Função para atualizar saldos
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalances()
      await usdtBalance.refetch()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // Função para trocar para Polygon
  const switchToPolygon = () => {
    if (switchChain) {
      switchChain({ chainId: polygon.id })
    }
  }
  
  // Função para expandir/recolher tokens
  const toggleTokenExpansion = (tokenId: string) => {
    setExpandedTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }))
  }
  
  // Função para alternar visibilidade do token
  const toggleTokenVisibility = (tokenId: string) => {
    setTokenToggles(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }))
  }
  
  // Lista de tokens para exibir - Material Design Colors
  const tokenList = [
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      balance: usdtBalance.balance,
      usdValue: usdtBalance.balanceAsNumber,
        icon: '💚',
        color: 'bg-teal-600',
        isExpandable: true,
        isLoading: usdtBalance.isLoading,
    },
    {
      id: 'matic',
      name: 'Polygon',
      symbol: 'MATIC',
      balance: balances.matic.balance,
      usdValue: balances.matic.usdValue || 0,
        icon: '🟣',
        color: 'bg-indigo-600',
        isExpandable: false,
        isLoading: isLoading,
    },
    {
      id: 'sol',
      name: 'Solana',
      symbol: 'SOL',
      balance: '0.00',
      usdValue: 0,
        icon: '🟠',
        color: 'bg-orange-600',
        isExpandable: false,
        isLoading: false,
    },
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: '0.00',
      usdValue: 0,
        icon: '⚪',
        color: 'bg-slate-500',
        isExpandable: false,
        isLoading: false,
    },
    {
      id: 'trx',
      name: 'Tron',
      symbol: 'TRX',
      balance: '0.00',
      usdValue: 0,
      icon: '🔴',
      color: 'bg-red-600',
      isExpandable: false,
      isLoading: false,
    },
    {
      id: 'thorchain',
      name: 'THORChain',
      symbol: 'RUNE',
      balance: '0.00',
      usdValue: 0,
        icon: '⚡',
        color: 'bg-green-500',
        isExpandable: true,
        isLoading: false,
    },
    {
      id: 'dash',
      name: 'Dash',
      symbol: 'DASH',
      balance: '0.00',
      usdValue: 0,
        icon: '💙',
        color: 'bg-sky-500',
        isExpandable: true,
        isLoading: false,
    },
  ]
  
  // Se não estiver conectado
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Wallet className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Carteira Digital
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Conecte sua carteira e comece com <span className="text-orange-400 font-semibold">R$ 25,00</span> de bônus
            </p>
          </div>

          {/* Main Card */}
          <Card className="w-full max-w-sm bg-gray-900/70 border-gray-700/50 backdrop-blur-xl shadow-2xl">
            <div className="p-6">
              {/* Connection Button */}
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button 
                    onClick={openConnectModal}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
                    size="lg"
                  >
                    <Wallet className="mr-3 h-5 w-5" />
                    Conectar Carteira
                  </Button>
                )}
              </ConnectButton.Custom>
              
              {/* Features */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Bônus de Boas-vindas</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Receba <span className="text-green-400 font-semibold">R$ 25,00</span> ao conectar pela primeira vez</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scan className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Apostas Instantâneas</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Use USDT na Polygon - <span className="text-blue-400 font-semibold">Taxa de gas ~$0,01</span></p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowUpDown className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Ganhos Elevados</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Multiplicadores até <span className="text-purple-400 font-semibold">1000x</span> no Plinko</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wallet className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Saque Rápido</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Retire seus ganhos em <span className="text-orange-400 font-semibold">menos de 5 minutos</span></p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Previous Session */}
          {hasValidSession() && sessionInfo && (
            <Card className="w-full max-w-sm mt-4 bg-gray-800/50 border-gray-600/50 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm font-medium">Sessão Anterior - Saldo: <span className="text-green-400">$127.50</span></p>
                    <p className="text-gray-400 text-xs font-mono">
                      {formatAddress(sessionInfo.address, 6)} • Última conexão há 2h
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-400 hover:text-orange-300 text-xs px-3 py-1 border border-orange-400/30 rounded-lg"
                  >
                    Reconectar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Supported Wallets */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs mb-3">Carteiras Suportadas</p>
            <div className="flex justify-center space-x-4">
              <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">M</span>
              </div>
              <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">W</span>
              </div>
              <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">R</span>
              </div>
              <div className="w-10 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">T</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">MetaMask • WalletConnect • Rainbow • Trust Wallet</p>
          </div>

          {/* Network Info */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <p className="text-gray-500 text-xs">
              Rede Requerida: <span className="text-purple-400 font-medium">Polygon</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-950">
        {/* Status Bar - Android Style */}
        <div className="bg-gray-900 h-6 w-full fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-2">
          <div className="flex items-center space-x-2">
            <div className="text-white text-xs">4G</div>
            <div className="text-white text-xs">100%</div>
            <div className="w-4 h-3 border border-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-white"></div>
            </div>
          </div>
        </div>
        
        {/* App Bar - Material Design */}
        <div className="bg-gray-900 shadow-md pt-6 pb-2 px-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {ensName || formatAddress(walletAddress || '', 6)}
                </p>
                {!isCorrectNetwork && (
                  <p className="text-amber-400 text-xs font-medium">Rede Incorreta</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Scan className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Alerta de rede incorreta - Material Design */}
        {!isCorrectNetwork && (
          <div className="px-4 mt-2 mb-4">
            <Card className="p-4 bg-amber-700/20 border-none rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-amber-100 font-medium text-sm">
                    Conecte-se à rede Polygon
                  </p>
                  <p className="text-amber-200/60 text-xs mt-0.5">
                    Necessário para transações
                  </p>
                </div>
                <Button 
                  onClick={switchToPolygon}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  Trocar
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Balance Display - Material Design */}
        <div className="px-4 mt-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-none rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-purple-200 text-sm font-medium">Saldo Total</p>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="ghost"
                  size="sm"
                  className="text-purple-200 hover:text-white p-1 rounded-full hover:bg-purple-700/30 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-baseline space-x-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-48 bg-purple-300/20" />
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">
                      {totalUSDValue.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className="text-xl text-purple-200 font-medium">USD</span>
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-purple-700/50 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-purple-700/30 hover:bg-purple-700/50 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    <span>Enviar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-purple-700/30 hover:bg-purple-700/50 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                  >
                    <Scan className="h-3 w-3 mr-1" />
                    <span>Receber</span>
                  </Button>
                </div>
                <Badge className="bg-purple-600/50 text-purple-100 text-xs px-2 py-1 rounded-full">
                  {networkName}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Tokens List - Material Design */}
        <div className="px-4 space-y-3 mb-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-white text-lg font-medium">Meus Ativos</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors text-xs"
            >
              Ver Todos
            </Button>
          </div>
          
          {tokenList.map((token) => (
            <Card 
              key={token.id} 
              className="bg-gray-800 border-none rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${token.color} rounded-full flex items-center justify-center text-white text-lg shadow-md`}>
                      {token.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{token.name}</p>
                        {token.isExpandable && (
                          <Button
                            onClick={() => toggleTokenExpansion(token.id)}
                            variant="ghost"
                            size="sm"
                            className="p-0 h-5 w-5 text-gray-300 hover:text-white rounded-full hover:bg-gray-700/50 transition-colors"
                          >
                            {expandedTokens[token.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">{token.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {token.isLoading ? (
                        <Skeleton className="h-4 w-16 bg-gray-700" />
                      ) : (
                        <>
                          <p className="text-white font-medium text-sm">
                            {token.balance} {token.symbol}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {formatUSD(token.usdValue)}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <Toggle
                      pressed={tokenToggles[token.id]}
                      onPressedChange={() => toggleTokenVisibility(token.id)}
                      className="data-[state=on]:bg-purple-600 data-[state=off]:bg-gray-600 w-10 h-6 rounded-full"
                    >
                      <div className="w-4 h-4 bg-white rounded-full transition-transform data-[state=on]:translate-x-2 shadow-sm" />
                    </Toggle>
                  </div>
                </div>
                
                {/* Expanded Content - Material Design */}
                {expandedTokens[token.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50 animate-fadeIn">
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-gray-300 mb-1 text-xs">Endereço da Carteira</p>
                        <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg">
                          <p className="text-white font-mono text-xs">
                            {formatAddress(walletAddress || '')}
                          </p>
                          <div className="flex space-x-1">
                            <Button
                              onClick={copyAddress}
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 text-gray-300 hover:text-white rounded-full hover:bg-gray-600/50"
                            >
                              {copied ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 text-gray-300 hover:text-white rounded-full hover:bg-gray-600/50"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-300 mb-1 text-xs">Rede</p>
                          <Badge 
                            variant={isCorrectNetwork ? "default" : "destructive"}
                            className={`text-xs px-2 py-1 rounded-full ${isCorrectNetwork ? "bg-green-600" : "bg-red-600"}`}
                          >
                            {networkName}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-gray-700/50 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-full"
                        >
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Navigation - Material Design */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
          <div className="flex justify-around items-center py-2 px-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white rounded-full p-1 transition-colors"
            >
              <Send className="h-5 w-5" />
              <span className="text-[10px]">Enviar</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-purple-500 relative"
            >
              <div className="absolute -top-1 w-full flex justify-center">
                <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
              </div>
              <Wallet className="h-5 w-5" />
              <span className="text-[10px]">Carteira</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white rounded-full p-1 transition-colors"
            >
              <Scan className="h-5 w-5" />
              <span className="text-[10px]">Receber</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white rounded-full p-1 transition-colors"
            >
              <ArrowUpDown className="h-5 w-5" />
              <span className="text-[10px]">Trocar</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 text-gray-400 hover:text-white rounded-full p-1 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span className="text-[10px]">Config</span>
            </Button>
          </div>
          
          {/* Home Indicator for Android */}
          <div className="flex justify-center py-1 bg-black">
            <div className="w-24 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
        
        {/* Padding bottom for fixed navigation */}
        <div className="h-20" />
      </div>
    </TooltipProvider>
  )
}