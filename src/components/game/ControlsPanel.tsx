'use client';

import { useState } from 'react';
import { Play, Minus, Plus, Coins, TrendingUp } from 'lucide-react';
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
    <div className="casino-glass rounded-2xl casino-glow-secondary p-6 space-y-6">
      <div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-casino-gold rounded-lg flex items-center justify-center">
            <Coins className="w-4 h-4 text-casino-dark" />
          </div>
          <h3 className="text-lg font-semibold text-casino-light">Controles de Aposta</h3>
        </div>
        
        {/* Bet Amount Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-casino-light/80">Valor da Aposta</label>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBetAmount(0.5)}
              disabled={isPlaying}
              className="border-casino-quaternary bg-casino-quaternary/20 text-casino-light hover:bg-casino-quaternary/40 hover:border-casino-gold transition-all"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={isPlaying}
              className="text-center bg-casino-quaternary/20 border-casino-quaternary text-casino-light placeholder-casino-light/40 focus:border-casino-gold focus:ring-casino-gold/20"
              placeholder="0"
              min="1"
              max={balance}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBetAmount(2)}
              disabled={isPlaying || betAmount * 2 > balance}
              className="border-casino-quaternary bg-casino-quaternary/20 text-casino-light hover:bg-casino-quaternary/40 hover:border-casino-gold transition-all"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Bet Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-casino-light/80">Apostas Rápidas</label>
          <div className="grid grid-cols-2 gap-2">
            {quickBetAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount)}
                disabled={isPlaying || amount > balance}
                className="border-casino-quaternary bg-casino-quaternary/20 text-casino-light hover:bg-casino-gold hover:text-casino-dark hover:border-casino-gold transition-all font-medium"
              >
                R$ {amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Multiplier Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-casino-light/80">Multiplicadores</label>
          <div className="grid grid-cols-2 gap-2">
            {multiplierButtons.map((multiplier) => (
              <Button
                key={multiplier}
                variant="outline"
                size="sm"
                onClick={() => adjustBetAmount(multiplier)}
                disabled={isPlaying || betAmount * multiplier > balance}
                className="border-casino-quaternary bg-casino-quaternary/20 text-casino-cyan hover:bg-casino-cyan hover:text-casino-dark hover:border-casino-cyan transition-all font-medium"
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
        className="w-full bg-casino-gradient hover:scale-105 text-casino-dark font-bold py-4 text-lg rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 casino-glow-gold"
      >
        {isPlaying ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-casino-dark border-t-transparent rounded-full animate-spin" />
            <span>JOGANDO...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>JOGAR AGORA</span>
          </div>
        )}
      </Button>

      {/* Bet Info */}
      <div className="casino-glass rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-casino-gold" />
          <span className="text-sm font-medium text-casino-light">Informações da Aposta</span>
        </div>
        <div className="text-sm text-casino-light/80 space-y-1">
          <div className="flex justify-between">
            <span>Aposta:</span>
            <span className="text-casino-gold font-medium">R$ {betAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Saldo após aposta:</span>
            <span className="text-casino-light font-medium">R$ {(balance - betAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}