'use client';

import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

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
    if (winAmount > betAmount) return 'text-green-400';
    if (winAmount < betAmount) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getResultIcon = (winAmount: number, betAmount: number) => {
    if (winAmount > betAmount) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (winAmount < betAmount) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 rounded-full bg-yellow-400" />;
  };

  const totalWinnings = gameHistory.reduce((sum, game) => sum + (game.winAmount - game.betAmount), 0);
  const totalGames = gameHistory.length;
  const winRate = totalGames > 0 ? (gameHistory.filter(game => game.winAmount > game.betAmount).length / totalGames * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Histórico de Jogadas</h3>
      </div>

      {/* Statistics */}
      {totalGames > 0 && (
        <div className="grid grid-cols-1 gap-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600">Lucro Total</p>
            <p className={`text-sm font-bold ${
              totalWinnings >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatCurrency(totalWinnings)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-600">Jogadas</p>
              <p className="text-sm font-bold text-gray-800">{totalGames}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">Taxa de Vitória</p>
              <p className="text-sm font-bold text-blue-600">{winRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {gameHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-600 text-sm">Nenhuma jogada ainda</p>
            <p className="text-gray-500 text-xs mt-1">Faça sua primeira aposta para ver o histórico</p>
          </div>
        ) : (
          gameHistory.map((game) => {
            const profit = game.winAmount - game.betAmount;
            const isWin = profit > 0;
            const isLoss = profit < 0;
            
            return (
              <div
                key={game.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getResultIcon(game.winAmount, game.betAmount)}
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-800">
                        {game.multiplier}x
                      </span>
                      <span className="text-xs text-gray-600">
                        {formatTime(game.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
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
                  
                  <div className={`text-xs ${
                    isWin ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'
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