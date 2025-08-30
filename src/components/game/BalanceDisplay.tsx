'use client';

import { Coins } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30">
      <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-full">
        <Coins className="w-5 h-5 text-yellow-400" />
      </div>
      
      <div>
        <p className="text-sm text-gray-300 font-medium">Saldo Atual</p>
        <p className="text-xl font-bold text-white">
          {formatBalance(balance)}
        </p>
      </div>
    </div>
  );
}