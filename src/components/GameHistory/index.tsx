'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trophy, TrendingDown } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export default function GameHistory() {
  const { history } = useGameStore();

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWinTypeIcon = (winType: string) => {
    switch (winType) {
      case 'mega':
        return '💎';
      case 'big':
        return '🔥';
      default:
        return '⭐';
    }
  };

  const getWinTypeColor = (winType: string) => {
    switch (winType) {
      case 'mega':
        return 'text-purple-400';
      case 'big':
        return 'text-orange-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
        <History className="w-5 h-5" />
        <span>HISTÓRICO</span>
      </h3>
      
      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 py-8"
            >
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma jogada ainda</p>
              <p className="text-xs mt-1">Faça sua primeira aposta!</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 10).map((game, index) => (
                <motion.div
                  key={`${game.timestamp}-${index}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                    game.isWin
                      ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                      : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {game.isWin ? (
                        <Trophy className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <div className="flex gap-1">
                        {game.symbols[0]?.map((symbol, symbolIndex) => (
                          <span key={symbolIndex} className="text-sm">
                            {symbol}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        game.isWin ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {game.isWin ? '+' : '-'}R$ {game.isWin ? game.winAmount.toFixed(2) : game.betAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTime(game.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {game.isWin && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400">Tipo:</span>
                        <span className={`text-xs font-bold ${getWinTypeColor(game.winType)}`}>
                          {getWinTypeIcon(game.winType)} {game.winType.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Aposta: R$ {game.betAmount.toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  {game.winningLines && game.winningLines.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">Linhas: </span>
                      {game.winningLines.map((line, lineIndex) => (
                        <span key={lineIndex} className="text-xs text-yellow-400 mr-1">
                          L{line + 1}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {history.length > 10 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">
            Mostrando 10 de {history.length} jogadas
          </span>
        </div>
      )}
      
      {/* Resumo Rápido */}
      {history.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-600/30">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400 mb-1">Última Jogada</div>
              <div className={`font-bold ${
                history[0].isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {history[0].isWin ? 'Vitória' : 'Derrota'}
              </div>
            </div>
            <div className="text-center p-2 bg-black/20 rounded">
              <div className="text-gray-400 mb-1">Sequência</div>
              <div className="font-bold text-blue-400">
                {history.slice(0, 5).filter(g => g.isWin).length}/5
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}