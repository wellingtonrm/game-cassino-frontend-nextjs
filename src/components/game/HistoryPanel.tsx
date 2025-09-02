'use client';

import React from 'react';
import { Clock, TrendingUp, TrendingDown, History, Trophy } from 'lucide-react';
import { usePlinkoStore } from '@/stores/plinkoStore';
import { cn } from '@/lib/utils';

/**
 * HistoryPanel Component
 * 
 * Displays game history with statistics using Zustand store.
 * Follows Material You design principles for consistency.
 */
export const HistoryPanel: React.FC = () => {
  const { history, getStats } = usePlinkoStore();
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const stats = getStats();

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(6); // Match the balance format
  };

  const getResultColor = (payout: number, betAmount: number) => {
    if (payout > betAmount) return 'text-green-400';
    if (payout < betAmount) return 'text-red-400';
    return 'text-blue-400';
  };

  const getResultIcon = (payout: number, betAmount: number) => {
    if (payout > betAmount) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (payout < betAmount) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 rounded-full bg-blue-400" />;
  };

  return (
    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg mx-3 p-3">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-5 h-5 text-purple-400" />
        <h3 className="text-sm font-bold text-purple-400">Game History</h3>
        <span className="text-xs text-gray-400">({history.length})</span>
      </div>

      {/* Statistics */}
      {isClient && stats.totalGames > 0 && (
        <div className="bg-[#2a2a3e] rounded-lg p-3 mb-3">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-gray-400 font-medium">Net Profit</p>
            </div>
            <p className={cn(
              "text-lg font-bold",
              stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {stats.netProfit >= 0 ? '+' : ''}{formatCurrency(stats.netProfit)}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-gray-400">Games</p>
              <p className="text-sm font-bold text-white">{stats.totalGames}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-sm font-bold text-blue-400">{stats.winRate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Max Multi</p>
              <p className="text-sm font-bold text-yellow-500">{stats.maxMultiplier.toFixed(1)}x</p>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {!isClient ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-700/50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-700/50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">No games yet</p>
            <p className="text-gray-500 text-xs mt-1">Start playing to see your history</p>
          </div>
        ) : (
          history.slice(0, 10).map((game, index) => {
            const profit = game.payout - game.betAmount;
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-[#2a2a3e] rounded-lg border border-gray-600/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-600/50 flex items-center justify-center">
                    {getResultIcon(game.payout, game.betAmount)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {game.multiplier.toFixed(1)}x
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(game.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Bet: {formatCurrency(game.betAmount)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={cn(
                    "text-sm font-bold",
                    getResultColor(game.payout, game.betAmount)
                  )}>
                    {formatCurrency(game.payout)}
                  </div>
                  
                  <div className={cn(
                    "text-xs font-medium",
                    profit >= 0 ? 'text-green-400' : 'text-red-400'
                  )}>
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
};