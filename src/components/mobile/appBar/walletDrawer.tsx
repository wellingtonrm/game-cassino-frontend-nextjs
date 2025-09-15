'use client'

import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
    DrawerTrigger
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet'
import { formatAddress, formatUSD } from '@/web3/util/web3Utils'
import { Wallet, X, Loader2, AlertCircle, ChevronDown, DollarSign } from 'lucide-react'
import { useAuth } from '@/providers/auth-provider'
import { useAccount } from 'wagmi'
import Image  from 'next/image'

const WalletDrawer = ()=> {
    const { address, isConnected,  } = useAccount()
    const {
        balances,
        isCorrectNetwork,
        disconnect
    } = useWeb3Wallet()
    
    const { 
        state: { isAuthenticated, isLoading }, 
        authenticate 
    } = useAuth()

    // Calculate total USD value from individual balances
    const totalUSDValue = (balances?.matic?.usdValue !== undefined ? parseFloat(balances.matic.usdValue.toString()) : 0) + 
                          (balances?.usdt?.usdValue !== undefined ? parseFloat(balances.usdt.usdValue.toString()) : 0);
    
    // Provide default network name
    const networkName = 'Polygon';

    // Only show the drawer if wallet is connected
    if (!isConnected || !address) {
        return null
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    className="bg-[#202026]  px-4 py-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    aria-label="Open wallet"
                >
                    <div className="flex items-center gap-2 min-w-0">
                                                 <Image src={"/cript-icons/usdt.svg"} width={25} height={25} alt="wallet" />

                        {/* <div className="flex-shrink-0 w-6 h-6 bg-[#fdbf5c] rounded-full flex items-center justify-center">
                             <DollarSign className="h-3 w-3 text-[#121214] font-bold" /> 
                         </div> */}
                        <div className="flex flex-col items-start min-w-0">
                            <span className="text-xs text-gray-400 leading-none">USDT</span>
                            <span className="text-sm font-semibold text-white leading-none truncate">
                                {isAuthenticated && balances?.usdt ? 
                                    formatUSD(balances.usdt.usdValue || 0.000000) : 
                                    '--'
                                }
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-[#fdbf5c] flex-shrink-0" />
                    </div>
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className="bg-[#121214] text-white border-t border-[#1A2040]"
            >
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="flex justify-between items-center px-4">
                        <div>
                            <DrawerTitle className="text-white">Detalhes da Carteira</DrawerTitle>
                            <DrawerDescription className="text-gray-400">
                                Informações da sua conta e saldos
                            </DrawerDescription>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#fdbf5c]">
                                <X className="h-5 w-5" />
                            </Button>
                        </DrawerClose>
                    </DrawerHeader>

                    <div className="px-4 pb-6 space-y-6">
                        {/* Wallet Address */}
                        <div className="bg-[#1A2040] rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Endereço da Carteira</h3>
                            <p className="font-mono text-sm break-all">{formatAddress(address || '')}</p>
                        </div>

                        {/* Network Info */}
                        <div className="bg-[#1A2040] rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Rede</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-white">{networkName || 'Desconhecida'}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${isCorrectNetwork ? 'bg-[#fdbf5c] text-[#121214]' : 'bg-[#d43a00] text-white'
                                    }`}>
                                    {isCorrectNetwork ? 'Conectado' : 'Rede Incorreta'}
                                </span>
                            </div>
                        </div>

                        {/* Authentication Status */}
                        {!isAuthenticated && (
                            <div className="bg-[#1A2040] rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-400 mb-2">Autenticação</h3>
                               
                                <Button
                                    onClick={() => authenticate()}
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] text-[#121214] font-semibold"
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
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Você precisa assinar uma mensagem para provar a posse da carteira
                                </p>
                            </div>
                        )}

                        {/* Balances */}
                        {isAuthenticated && (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-gray-400">Saldos</h3>

                                    {/* USDT Balance */}
                                    <div className="bg-[#1A2040] rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-white">USDT</p>
                                                <p className="text-sm text-gray-400">{balances.usdt.formatted}</p>
                                            </div>
                                            <p className="font-medium text-white">{formatUSD(balances.usdt.usdValue || 0)}</p>
                                        </div>
                                    </div>

                                    {/* MATIC Balance */}
                                    <div className="bg-[#1A2040] rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-white">MATIC</p>
                                                <p className="text-sm text-gray-400">{balances.matic.formatted}</p>
                                            </div>
                                            <p className="font-medium text-white">{formatUSD(balances.matic.usdValue || 0)}</p>
                                        </div>
                                    </div>

                                    {/* Total Balance */}
                                    <div className="bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-[#121214]">Saldo Total</p>
                                            <p className="font-bold text-[#121214] text-lg">{formatUSD(totalUSDValue)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pt-4 space-y-3">
                                    <Button
                                        onClick={disconnect}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Desconectar Carteira
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default WalletDrawer