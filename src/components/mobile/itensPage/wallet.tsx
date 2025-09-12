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
} from '@/web3/util/web3Utils'

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
  
  // When the component is mounted, set loading to false
  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 700) // 700ms delay to simulate loading
    
    return () => clearTimeout(timer)
  }, [setPageLoading])
  
  // Web3 Hooks
  const { address } = useAccount()
  const currentChainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Custom hooks
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
  
  // Session state
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  
  // Load session information when mounting
  useEffect(() => {
    const info = getSessionInfo()
    setSessionInfo(info)
  }, [getSessionInfo, isConnected])
  
  // Save session when connecting
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
  
  // Function to copy address
  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  // Function to refresh balances
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshBalances()
      await usdtBalance.refetch()
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // Function to switch to Polygon
  const switchToPolygon = () => {
    if (switchChain) {
      switchChain({ chainId: polygon.id })
    }
  }
  
  // Function to expand/collapse tokens
  const toggleTokenExpansion = (tokenId: string) => {
    setExpandedTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }))
  }
  
  // Function to toggle token visibility
  const toggleTokenVisibility = (tokenId: string) => {
    setTokenToggles(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }))
  }
  
  // Token list to display - Material Design Colors
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
  
  // If not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#121214]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#fdbf5c] rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-10 w-40 h-40 bg-[#f69a0b] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#d43a00] rounded-full blur-3xl opacity-50" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#fdbf5c] to-[#f69a0b] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Wallet className="h-12 w-12 text-[#121214]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Digital Wallet
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Connect your wallet and start with <span className="text-[#fdbf5c] font-semibold">$25.00</span> bonus
            </p>
          </div>

          {/* Main Card */}
          <Card className="w-full max-w-sm bg-[#1A2040] border-[#1A2040] backdrop-blur-xl shadow-2xl">
            <div className="p-6">
              {/* Connection Button */}
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button 
                    onClick={openConnectModal}
                    className="w-full bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#fdbf5c]/25"
                    size="lg"
                  >
                    <Wallet className="mr-3 h-5 w-5" />
                    Connect Wallet
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
                    <p className="text-white font-medium text-sm">Welcome Bonus</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Receive <span className="text-green-400 font-semibold">$25.00</span> when connecting for the first time</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scan className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Instant Bets</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Use USDT on Polygon - <span className="text-blue-400 font-semibold">Gas fee ~$0.01</span></p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ArrowUpDown className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">High Wins</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Multipliers up to <span className="text-purple-400 font-semibold">1000x</span> on Plinko</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wallet className="h-4 w-4 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Fast Withdrawals</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Withdraw your winnings in <span className="text-orange-400 font-semibold">less than 5 minutes</span></p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Previous Session */}
          {hasValidSession() && sessionInfo && (
            <Card className="w-full max-w-sm mt-4 bg-[#1A2040] border-[#1A2040] backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm font-medium">Previous Session - Balance: <span className="text-green-400">$127.50</span></p>
                    <p className="text-gray-400 text-xs font-mono">
                      {formatAddress(sessionInfo.address, 6)} • Last connection 2h ago
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#fdbf5c] hover:text-[#f69a0b] text-xs px-3 py-1 border border-[#fdbf5c]/30 rounded-lg"
                  >
                    Reconnect
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Supported Wallets */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs mb-3">Supported Wallets</p>
            <div className="flex justify-center space-x-4">
              <div className="w-10 h-10 bg-[#1A2040] rounded-xl flex items-center justify-center">
                <span className="text-[#fdbf5c] font-bold text-sm">M</span>
              </div>
              <div className="w-10 h-10 bg-[#1A2040] rounded-xl flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">W</span>
              </div>
              <div className="w-10 h-10 bg-[#1A2040] rounded-xl flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">R</span>
              </div>
              <div className="w-10 h-10 bg-[#1A2040] rounded-xl flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">T</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">MetaMask • WalletConnect • Rainbow • Trust Wallet</p>
          </div>

          {/* Network Info */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-center">
            <div className="w-2 h-2 bg-[#fdbf5c] rounded-full" />
            <p className="text-gray-500 text-xs">
              Required Network: <span className="text-[#fdbf5c] font-medium">Polygon</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#121214]">
       
        {/* Incorrect Network Alert - Material Design */}
        {!isCorrectNetwork && (
          <div className="px-4 mt-2 mb-4">
            <Card className="p-4 bg-amber-700/20 border-none rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-amber-100 font-medium text-sm">
                    Connect to Polygon Network
                  </p>
                  <p className="text-amber-200/60 text-xs mt-0.5">
                    Required for transactions
                  </p>
                </div>
                <Button 
                  onClick={switchToPolygon}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                >
                  Switch
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Balance Display - Material Design */}
        <div className="px-4 mt-4 mb-6">
          <Card className="bg-gradient-to-br from-[#fdbf5c] to-[#f69a0b] border-none rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#121214]/80 text-sm font-medium">Total Balance</p>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="ghost"
                  size="sm"
                  className="text-[#121214]/80 hover:text-[#121214] p-1 rounded-full hover:bg-[#121214]/20 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <div className="flex items-baseline space-x-2">
                {isLoading ? (
                  <Skeleton className="h-12 w-48 bg-[#121214]/20" />
                ) : (
                  <>
                    <span className="text-4xl font-bold text-[#121214]">
                      {totalUSDValue.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span className="text-xl text-[#121214]/80 font-medium">USD</span>
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#121214]/30 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-[#121214]/20 hover:bg-[#121214]/30 text-[#121214] text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    <span>Send</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-[#121214]/20 hover:bg-[#121214]/30 text-[#121214] text-xs px-3 py-1 rounded-full flex items-center space-x-1"
                  >
                    <Scan className="h-3 w-3 mr-1" />
                    <span>Receive</span>
                  </Button>
                </div>
                <Badge className="bg-[#121214]/30 text-[#121214] text-xs px-2 py-1 rounded-full">
                  {networkName}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Tokens List - Material Design */}
        <div className="px-4 space-y-3 mb-4">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-white text-lg font-medium">My Assets</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors text-xs"
            >
              View All
            </Button>
          </div>
          
          {tokenList.map((token) => (
            <Card 
              key={token.id} 
              className="bg-[#1A2040] border-none rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out"
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
                      className="data-[state=on]:bg-[#fdbf5c] data-[state=off]:bg-gray-600 w-10 h-6 rounded-full"
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
                        <p className="text-gray-300 mb-1 text-xs">Wallet Address</p>
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
                          <p className="text-gray-300 mb-1 text-xs">Network</p>
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
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

     
      </div>
    </TooltipProvider>
  )
}