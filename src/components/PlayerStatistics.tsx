'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export const PlayerStatistics = () => {
  // Mock data for player statistics
  const stats = {
    totalGames: 127,
    winRate: 68.5,
    totalWinnings: 2450.75,
    favoriteGame: 'Plinko',
    avgBet: 25.50,
    biggestWin: 1250.00,
    longestWinStreak: 7,
    totalDeposits: 5000.00,
    totalWithdrawals: 2549.25,
  };

  const recentGames = [
    { game: 'Plinko', result: 'Win', amount: 125.50, date: '2023-06-15' },
    { game: 'Slots', result: 'Loss', amount: -25.00, date: '2023-06-14' },
    { game: 'Roulette', result: 'Win', amount: 75.25, date: '2023-06-14' },
    { game: 'Blackjack', result: 'Loss', amount: -50.00, date: '2023-06-13' },
    { game: 'Plinko', result: 'Win', amount: 250.00, date: '2023-06-12' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Total Games</h3>
          <p className="text-2xl font-bold text-white">{stats.totalGames}</p>
        </Card>
        
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Win Rate</h3>
          <p className="text-2xl font-bold text-green-400">{stats.winRate}%</p>
        </Card>
        
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Total Winnings</h3>
          <p className="text-2xl font-bold text-white">${stats.totalWinnings.toFixed(2)}</p>
        </Card>
        
        <Card className="p-4 bg-gray-800 border-gray-700">
          <h3 className="text-gray-400 text-sm mb-1">Favorite Game</h3>
          <p className="text-2xl font-bold text-purple-400">{stats.favoriteGame}</p>
        </Card>
      </div>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Average Bet</span>
              <span className="text-white">${stats.avgBet.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Biggest Win</span>
              <span className="text-green-400">${stats.biggestWin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Longest Win Streak</span>
              <span className="text-white">{stats.longestWinStreak}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Deposits</span>
              <span className="text-white">${stats.totalDeposits.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Withdrawals</span>
              <span className="text-white">${stats.totalWithdrawals.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Net Profit</span>
              <span className={stats.totalWinnings >= 0 ? "text-green-400" : "text-red-400"}>
                ${stats.totalWinnings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Games</h2>
        <div className="space-y-3">
          {recentGames.map((game, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{game.game}</p>
                <p className="text-gray-400 text-sm">{game.date}</p>
              </div>
              <div className="text-right">
                <p className={game.result === 'Win' ? "text-green-400" : "text-red-400"}>
                  {game.result} ${Math.abs(game.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};