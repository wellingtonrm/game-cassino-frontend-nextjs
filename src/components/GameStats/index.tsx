'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export default function GameStats() {
  const { getStats } = useGameStore();
  const stats = getStats();

  const statItems = [
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Total de Jogos',
      value: stats.totalGames.toString(),
      color: 'text-blue-400'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Vitórias',
      value: stats.wins.toString(),
      color: 'text-green-400'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Taxa de Vitória',
      value: `${stats.winRate.toFixed(1)}%`,
      color: stats.winRate >= 50 ? 'text-green-400' : stats.winRate >= 25 ? 'text-yellow-400' : 'text-red-400'
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Lucro Líquido',
      value: `R$ ${stats.netProfit.toFixed(2)}`,
      color: stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Big Wins',
      value: stats.bigWins.toString(),
      color: 'text-orange-400'
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Mega Wins',
      value: stats.megaWins.toString(),
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
        📊 <span>ESTATÍSTICAS</span>
      </h3>
      
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <span className={item.color}>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <motion.span 
              className={`font-bold text-sm ${item.color}`}
              key={item.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {item.value}
            </motion.span>
          </motion.div>
        ))}
      </div>
      
      {/* Barra de Progresso para Taxa de Vitória */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Taxa de Vitória</span>
          <span>{stats.winRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full transition-all duration-500 ${
              stats.winRate >= 50 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : stats.winRate >= 25 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(stats.winRate, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
      
      {/* Indicadores de Performance */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-black/20 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Melhor Sequência</div>
          <div className="text-sm font-bold text-green-400">
            {stats.wins > 0 ? '🔥' : '💤'} {stats.wins > 0 ? 'Ativo' : 'Inativo'}
          </div>
        </div>
        <div className="text-center p-2 bg-black/20 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className={`text-sm font-bold ${
            stats.netProfit > 0 ? 'text-green-400' : stats.netProfit < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {stats.netProfit > 0 ? '📈 Lucro' : stats.netProfit < 0 ? '📉 Prejuízo' : '➖ Neutro'}
          </div>
        </div>
      </div>
    </div>
  );
}