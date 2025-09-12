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
  ArrowUpDown,
  Wifi,
  WifiOff
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
import { formatAddress } from '@/lib/utils'

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
  
  // Custom hooks
  const {
    address: walletAddress,
    ensName,
    isConnected,
    chainId,
    connector,
    isLoading,
    error,
    isOnline,
    connectionStatus,
    isCorrectNetwork,
    balances,
    disconnect,
    refreshBalances,
    clearError,
  } = useWeb3Wallet()
  
  const { saveSession, loadSession, hasValidSession, getSessionInfo } = useSessionCookie()
  
  // Session state
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  
  // Load session information when mounting
  useEffect(() => {
    const info = getSessionInfo()
    setSessionInfo(info)
  }, [getSessionInfo])
  
  // Save session when connecting
  useEffect(() => {
    if (isConnected && walletAddress && chainId && connector) {
      saveSession({
        address: walletAddress,
        chainId,
        maticBalance: balances.matic.balance,
        usdtBalance: balances.usdt.balance,
        connector,
        connectedAt: Date.now(),
        lastUpdated: Date.now(),
      })
    }
  }, [isConnected, walletAddress, chainId, connector, balances, saveSession])

  const handleRefresh = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    try {
      await refreshBalances()
    } finally {
      setIsRefreshing(false)
    }
  }

  const toggleToken = (token: string) => {
    setTokenToggles(prev => ({
      ...prev,
      [token]: !prev[token]
    }))
  }

  const toggleTokenExpand = (token: string) => {
    setExpandedTokens(prev => ({
      ...prev,
      [token]: !prev[token]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwitchToPolygon = () => {
    // This would need to be implemented properly
    console.log('Switch to Polygon')
  }

  // Format USD value (simple implementation)
  const formatUSD = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numValue)
  }

  return (
    <div className="min-h-screen text-white flex flex-col">
      <main className="flex-1 overflow-auto pb-16">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Wallet</h1>
            <div className="flex items-center space-x-2">
              {isConnected && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={isRefreshing || !isOnline}
                  className="p-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              {isConnected && (
                <div className={`flex items-center ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                  {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                </div>
              )}
            </div>
          </div>

          {/* Connection Status Banner */}
          {!isOnline && (
            <Card className="w-full bg-red-900/50 border-red-800 mb-4">
              <div className="p-3 flex items-center">
                <WifiOff className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <p className="text-red-300 font-medium">Connection Lost</p>
                  <p className="text-red-400 text-sm">Please check your internet connection</p>
                </div>
              </div>
            </Card>
          )}

          {connectionStatus === 'reconnecting' && (
            <Card className="w-full bg-yellow-900/50 border-yellow-800 mb-4">
              <div className="p-3 flex items-center">
                <Wifi className="h-5 w-5 text-yellow-400 mr-2 animate-pulse" />
                <div>
                  <p className="text-yellow-300 font-medium">Reconnecting...</p>
                  <p className="text-yellow-400 text-sm">Attempting to restore connection</p>
                </div>
              </div>
            </Card>
          )}

          {/* Error Banner */}
          {error && (
            <Card className="w-full bg-red-900/50 border-red-800 mb-4">
              <div className="p-3 flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-300 font-medium">Error</p>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="p-1 h-auto"
                >
                  <XCircle className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          )}

          {/* Network Warning */}
          {isConnected && !isCorrectNetwork && (
            <Card className="w-full bg-orange-900/50 border-orange-800 mb-4">
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                    <div>
                      <p className="text-orange-300 font-medium">Wrong Network</p>
                      <p className="text-orange-400 text-sm">Switch to Polygon network</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleSwitchToPolygon}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Switch
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Wallet Connection */}
          {!isConnected ? (
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
          ) : null}

          {/* Main Card */}
          <Card className="w-full max-w-sm bg-[#1A2040] border-[#1A2040] backdrop-blur-xl shadow-2xl">
            <div className="p-6">
              {/* Connection Button */}
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button 
                    onClick={openConnectModal}
                    className="w-full bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#fdbf5c]/25"
                  >
                    {isConnected ? 'Connected' : 'Connect Wallet'}
                  </Button>
                )}
              </ConnectButton.Custom>

              {/* Wallet Info */}
              {isConnected && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-gray-300 text-sm">Connected</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={disconnect}
                      className="text-gray-400 hover:text-white"
                    >
                      <span className="text-xs">Disconnect</span>
                    </Button>
                  </div>

                  <div className="bg-[#121214]/50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Total Balance</span>
                      <span className="text-gray-300 text-sm">USD</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {formatUSD(
                        ((balances.matic.usdValue !== undefined ? parseFloat(balances.matic.usdValue.toString()) : 0) +
                        (balances.usdt.usdValue !== undefined ? parseFloat(balances.usdt.usdValue.toString()) : 0)).toString()
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* MATIC Balance */}
                    <div 
                      className="bg-[#121214]/50 rounded-xl p-3 cursor-pointer hover:bg-[#121214]/70 transition-colors"
                      onClick={() => toggleTokenExpand('matic')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">M</span>
                          </div>
                          <div>
                            <div className="font-medium text-white">MATIC</div>
                            <div className="text-gray-400 text-xs">Polygon</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{balances.matic.balance}</div>
                          <div className="text-gray-400 text-xs">
                            {balances.matic.usdValue !== undefined 
                              ? formatUSD(balances.matic.usdValue.toString()) 
                              : '$0.00'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* USDT Balance */}
                    <div 
                      className="bg-[#121214]/50 rounded-xl p-3 cursor-pointer hover:bg-[#121214]/70 transition-colors"
                      onClick={() => toggleTokenExpand('usdt')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">U</span>
                          </div>
                          <div>
                            <div className="font-medium text-white">USDT</div>
                            <div className="text-gray-400 text-xs">Tether</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{balances.usdt.balance}</div>
                          <div className="text-gray-400 text-xs">
                            {balances.usdt.usdValue !== undefined 
                              ? formatUSD(balances.usdt.usdValue.toString()) 
                              : '$0.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-bold">
                            {ensName ? ensName[0].toUpperCase() : (walletAddress ? walletAddress[2] : 'W')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">
                            {ensName || formatAddress(walletAddress || '', 6)}
                          </div>
                          <div className="text-gray-400 text-xs">
                            Polygon
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(walletAddress || '')}
                          className="p-2"
                        >
                          {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(`https://polygonscan.com/address/${walletAddress}`, '_blank')}
                          className="p-2"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Features */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3">Features</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-[#1A2040] border-[#1A2040] p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center mr-3">
                    <Send className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Fast Withdrawals</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Withdraw your winnings in <span className="text-orange-400 font-semibold">less than 5 minutes</span></p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}