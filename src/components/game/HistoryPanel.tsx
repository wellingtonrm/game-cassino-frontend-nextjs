'use client';

import { Clock, TrendingUp, TrendingDown, History, Trophy } from 'lucide-react';

interface GameResult {
  id: string;
  betAmount: number;
  multiplier: number;
  winAmount: number;
  timestamp: Date;
}

interface HistoryPanelProps {
  gameHistory: GameResult[];
}

export function HistoryPanel({ gameHistory }: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getResultColor = (winAmount: number, betAmount: number) => {
    if (winAmount > betAmount) return 'text-casino-gold';
    if (winAmount < betAmount) return 'text-casino-red';
    return 'text-casino-cyan';
  };

  const getResultIcon = (winAmount: number, betAmount: number) => {
    if (winAmount > betAmount) return <TrendingUp className="w-4 h-4 text-casino-gold" />;
    if (winAmount < betAmount) return <TrendingDown className="w-4 h-4 text-casino-red" />;
    return <div className="w-4 h-4 rounded-full bg-casino-cyan" />;
  };

  const totalWinnings = gameHistory.reduce((sum, game) => sum + (game.winAmount - game.betAmount), 0);
  const totalGames = gameHistory.length;
  const winRate = totalGames > 0 ? (gameHistory.filter(game => game.winAmount > game.betAmount).length / totalGames * 100) : 0;

  return (
    <div className="casino-glass rounded-xl casino-glow-secondary p-6 space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-casino-gold rounded-lg flex items-center justify-center">
          <History className="w-4 h-4 text-casino-dark" />
        </div>
        <h3 className="text-lg font-semibold text-casino-light">Histórico de Jogadas</h3>
      </div>

      {/* Statistics */}
      {totalGames > 0 && (
        <div className="casino-glass rounded-lg p-4 mb-4">
          <div className="text-center mb-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Trophy className="w-4 h-4 text-casino-gold" />
              <p className="text-xs text-casino-light/80 font-medium">Lucro Total</p>
            </div>
            <p className={`text-lg font-bold ${
              totalWinnings >= 0 ? 'text-casino-gold' : 'text-casino-red'
            }`}>
              {formatCurrency(totalWinnings)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-casino-light/60">Jogadas</p>
              <p className="text-sm font-bold text-casino-light">{totalGames}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-casino-light/60">Taxa de Vitória</p>
              <p className="text-sm font-bold text-casino-cyan">{winRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {gameHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-casino-quaternary/20 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-casino-light/40" />
            </div>
            <p className="text-casino-light/60 text-sm">Nenhuma jogada ainda</p>
            <p className="text-casino-light/40 text-xs mt-1">Faça sua primeira aposta para ver o histórico</p>
          </div>
        ) : (
          gameHistory.map((game) => {
            const profit = game.winAmount - game.betAmount;
            const isWin = profit > 0;
            const isLoss = profit < 0;
            
            return (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 casino-glass rounded-lg hover:bg-casino-quaternary/30 transition-all duration-200 border border-casino-quaternary/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-casino-quaternary/20 flex items-center justify-center">
                    {getResultIcon(game.winAmount, game.betAmount)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-casino-light">
                        {game.multiplier}x
                      </span>
                      <span className="text-xs text-casino-light/60">
                        {formatTime(game.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-casino-light/60">
                      Aposta: {formatCurrency(game.betAmount)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-bold ${
                    getResultColor(game.winAmount, game.betAmount)
                  }`}>
                    {formatCurrency(game.winAmount)}
                  </div>
                  
                  <div className={`text-xs font-medium ${
                    isWin ? 'text-casino-gold' : isLoss ? 'text-casino-red' : 'text-casino-cyan'
                  }`}>
                    {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}