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
    <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
        <Coins className="w-5 h-5 text-blue-600" />
      </div>
      
      <div>
        <p className="text-sm text-gray-600 font-medium">Saldo Atual</p>
        <p className="text-xl font-semibold text-gray-800">
          {formatBalance(balance)}
        </p>
      </div>
    </div>
  );
}