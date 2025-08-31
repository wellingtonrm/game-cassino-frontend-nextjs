'use client';

import { useState, useCallback, useRef } from 'react';
import { Trophy, Clock } from 'lucide-react';
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

  // Calculate stats
  const totalGames = gameHistory.length;
  const totalWinnings = gameHistory.reduce((sum, game) => sum + (game.winAmount - game.betAmount), 0);
  const winRate = totalGames > 0 ? (gameHistory.filter(game => game.winAmount > game.betAmount).length / totalGames * 100) : 0;
  const biggestWin = gameHistory.length > 0 ? Math.max(...gameHistory.map(game => game.winAmount)) : 0;

  return (
    <div className="min-h-screen">

      {/* Stats Bar */}
      <div className="bg-casino-quaternary border-b border-casino-tertiary">
        <div className="container mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-casino-light/60">Jogadas</div>
              <div className="text-sm font-bold text-casino-light">{totalGames}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-casino-light/60">Lucro Total</div>
              <div className={`text-sm font-bold ${
                totalWinnings >= 0 ? 'text-casino-gold' : 'text-casino-red'
              }`}>
                R$ {totalWinnings.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-casino-light/60">Taxa de Vitória</div>
              <div className="text-sm font-bold text-casino-cyan">{winRate.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-casino-light/60">Maior Vitória</div>
              <div className="text-sm font-bold text-casino-gold">R$ {biggestWin.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="xl:col-span-3">
            <div className="casino-glass rounded-2xl overflow-hidden casino-glow-primary">
              <div className="bg-casino-gradient p-6 border-b border-casino-quaternary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-casino-gold rounded-xl flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-casino-dark" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-casino-light">PLINKO PREMIUM</h2>
                      <p className="text-casino-light/60 text-sm">Deixe a sorte decidir seu destino</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isPlaying ? (
                      <div className="flex items-center space-x-2 text-casino-gold">
                        <div className="w-2 h-2 bg-casino-gold rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Jogando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-casino-light/60">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Pronto para jogar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-casino-dark">
                <PhaserGame 
                  ref={gameRef}
                  onBallComplete={handleBallComplete}
                  onBallDrop={handleBallDrop}
                  betAmount={betAmount}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
           <div className="space-y-6">

            {/* Controls */}
            <ControlsPanel
              balance={balance}
              betAmount={betAmount}
              onBetAmountChange={handleBetAmountChange}
              onPlay={handlePlay}
              isPlaying={isPlaying}
            />
            
            {/* History */}
            <HistoryPanel gameHistory={gameHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}