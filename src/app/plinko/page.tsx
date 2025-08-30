'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/game/Header';
import { PhaserGame, PhaserGameRef } from '@/components/game/PhaserGame';
import { ControlsPanel } from '@/components/game/ControlsPanel';
import { HistoryPanel } from '@/components/game/HistoryPanel';
import { BalanceDisplay } from '@/components/game/BalanceDisplay';

interface GameResult {
  id: string;
  betAmount: number;
  multiplier: number;
  winAmount: number;
  timestamp: Date;
}

export default function PlinkoPage() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const gameRef = useRef<PhaserGameRef>(null);

  const handleBetAmountChange = useCallback((amount: number) => {
    setBetAmount(Math.min(amount, balance));
  }, [balance]);

  const handlePlay = useCallback(() => {
    if (betAmount > balance || isPlaying) return;
    
    setIsPlaying(true);
    setBalance(prev => prev - betAmount);
    gameRef.current?.dropBall();
  }, [betAmount, balance, isPlaying]);

  const handleBallComplete = useCallback((multiplier: number) => {
    const winAmount = betAmount * multiplier;
    const newResult: GameResult = {
      id: Date.now().toString(),
      betAmount,
      multiplier,
      winAmount,
      timestamp: new Date()
    };

    setBalance(prev => prev + winAmount);
    setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
    setIsPlaying(false);
  }, [betAmount]);

  const handleBallDrop = useCallback(() => {
    // Ball has been dropped, game is now in progress
  }, []);

  return (
    <div className="min-h-screen">
      
      
      <div className=" mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Game Area */}
          <div className="lg:col-span-3 bg-[#010112] rounded-2xl  shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-100 mb-3">Plinko</h2>
              
            </div>
            
            <div className="p-4 h-[calc(100%-80px)]">
              <PhaserGame 
                ref={gameRef}
                onBallComplete={handleBallComplete}
                onBallDrop={handleBallDrop}
                betAmount={betAmount}
              />
            </div>
          </div>

          {/* Controls and History */}
          <div className="space-y-6">
            <ControlsPanel
              balance={balance}
              betAmount={betAmount}
              onBetAmountChange={handleBetAmountChange}
              onPlay={handlePlay}
              isPlaying={isPlaying}
            />
            
            <HistoryPanel gameHistory={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}