'use client';

import { useState } from 'react';
import { Play, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ControlsPanelProps {
  balance: number;
  betAmount: number;
  onBetAmountChange: (amount: number) => void;
  onPlay: () => void;
  isPlaying: boolean;
}

export function ControlsPanel({
  balance,
  betAmount,
  onBetAmountChange,
  onPlay,
  isPlaying
}: ControlsPanelProps) {
  const [inputValue, setInputValue] = useState(betAmount.toString());

  const quickBetAmounts = [10, 25, 50, 100];
  const multiplierButtons = [0.5, 2, 5, 10];

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= balance) {
      onBetAmountChange(numValue);
    }
  };

  const adjustBetAmount = (factor: number) => {
    const newAmount = Math.max(1, Math.min(balance, betAmount * factor));
    onBetAmountChange(newAmount);
    setInputValue(newAmount.toString());
  };

  const setBetAmount = (amount: number) => {
    const newAmount = Math.min(amount, balance);
    onBetAmountChange(newAmount);
    setInputValue(newAmount.toString());
  };

  const canPlay = betAmount > 0 && betAmount <= balance && !isPlaying;

  return (
    <div className="bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Controles de Aposta</h3>
        
        {/* Bet Amount Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Valor da Aposta</label>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBetAmount(0.5)}
              disabled={isPlaying}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={isPlaying}
              className="text-center bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="0"
              min="1"
              max={balance}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBetAmount(2)}
              disabled={isPlaying || betAmount * 2 > balance}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Apostas Rápidas</label>
          <div className="grid grid-cols-2 gap-2">
            {quickBetAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount)}
                disabled={isPlaying || amount > balance}
                className="border-white/20 text-white hover:bg-white/10"
              >
                R$ {amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Multiplier Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Multiplicadores</label>
          <div className="grid grid-cols-2 gap-2">
            {multiplierButtons.map((multiplier) => (
              <Button
                key={multiplier}
                variant="outline"
                size="sm"
                onClick={() => adjustBetAmount(multiplier)}
                disabled={isPlaying || betAmount * multiplier > balance}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {multiplier}x
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Play Button */}
      <Button
        onClick={onPlay}
        disabled={!canPlay}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Jogando...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Jogar</span>
          </div>
        )}
      </Button>

      {/* Bet Info */}
      <div className="text-sm text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Aposta:</span>
          <span className="text-white font-medium">R$ {betAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Saldo após aposta:</span>
          <span className="text-white font-medium">R$ {(balance - betAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}