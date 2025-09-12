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
import { useAccountWallet } from '@/hooks/useAccountWallet'
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet'
import { formatAddress, formatUSD } from '@/web3/util/web3Utils'
import { Wallet, X } from 'lucide-react'

const WalletDrawer = ()=> {
    const { hasWalletSession } = useAccountWallet()
    const {
        address,
        balances,
        totalUSDValue,
        isCorrectNetwork,
        networkName,
        disconnect
    } = useWeb3Wallet()

    // Only show the drawer if there's a valid wallet session
    const shouldShowDrawer = !!(hasWalletSession() && address)

    if (!shouldShowDrawer) {
        return null
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    className="bg-gradient-to-r from-[#fdbf5c] to-[#f69a0b] hover:from-[#f69a0b] hover:to-[#fdbf5c] p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                    aria-label="Open wallet"
                >
                    <Wallet className="h-5 w-5 text-[#121214] font-bold" />
                </Button>
            </DrawerTrigger>

            <DrawerContent
                className="bg-[#121214] text-white border-t border-[#1A2040]"
            >
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="flex justify-between items-center px-4">
                        <div>
                            <DrawerTitle className="text-white">Wallet Details</DrawerTitle>
                            <DrawerDescription className="text-gray-400">
                                Your account information and balances
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
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Wallet Address</h3>
                            <p className="font-mono text-sm break-all">{formatAddress(address || '')}</p>
                        </div>

                        {/* Network Info */}
                        <div className="bg-[#1A2040] rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Network</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-white">{networkName || 'Unknown'}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${isCorrectNetwork ? 'bg-[#fdbf5c] text-[#121214]' : 'bg-[#d43a00] text-white'
                                    }`}>
                                    {isCorrectNetwork ? 'Connected' : 'Wrong Network'}
                                </span>
                            </div>
                        </div>

                        {/* Balances */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-400">Balances</h3>

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
                                    <p className="font-medium text-[#121214]">Total Balance</p>
                                    <p className="font-bold text-[#121214] text-lg">{formatUSD(totalUSDValue)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4">
                            <Button
                                onClick={disconnect}
                                variant="destructive"
                                className="w-full"
                            >
                                Disconnect Wallet
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default WalletDrawer