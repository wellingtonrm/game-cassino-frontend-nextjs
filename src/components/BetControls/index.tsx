'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Volume2, VolumeX, Play, Square } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export default function BetControls() {
  const {
    betAmount,
    balance,
    isSpinning,
    soundEnabled,
    isAutoSpin,
    autoSpinCount,
    maxAutoSpins,
    setBetAmount,
    addCredits,
    toggleSound,
    startAutoSpin,
    stopAutoSpin
  } = useGameStore();

  return (
    <div className="space-y-4">
      {/* Valor da Rodada */}
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
            🎯 <span>VALOR DA RODADA</span>
          </h3>
          <div className="space-y-2">
            <motion.div 
              className="text-2xl font-bold text-white bg-black/20 rounded-lg py-2 px-3"
              key={betAmount}
              initial={{ scale: 1.1, color: '#10b981' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.3 }}
            >
              R$ {betAmount.toFixed(2)}
            </motion.div>
            <div className="space-y-3">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #6b7280 0%, #6b7280 ${((betAmount - 0.5) / 9.5) * 100}%, #374151 ${((betAmount - 0.5) / 9.5) * 100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-400 font-medium">
                <span>R$ 0,50</span>
                <span>R$ 10,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adicionar Créditos */}
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
          💰 <span>ADICIONAR CRÉDITOS</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[50, 100, 250, 500].map((amount) => (
            <motion.button
              key={amount}
              onClick={() => addCredits(amount)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-sm shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-3 h-3" />
              <span>R$ {amount}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Controles de Som */}
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
          🔊 <span>CONFIGURAÇÕES</span>
        </h3>
        <motion.button
          onClick={toggleSound}
          className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
            soundEnabled
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-300'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Som Ligado' : 'Som Desligado'}</span>
        </motion.button>
      </div>

      {/* Auto-Spin */}
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
        <h3 className="text-gray-300 font-bold text-lg mb-4 flex items-center justify-center gap-2">
          🔄 <span>AUTO-SPIN</span>
        </h3>
        
        {isAutoSpin && (
          <div className="mb-3 text-center">
            <div className="text-sm text-gray-400 mb-1">Rodadas Automáticas</div>
            <div className="text-lg font-bold text-white">
              {autoSpinCount} / {maxAutoSpins}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(autoSpinCount / maxAutoSpins) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <motion.button
          onClick={isAutoSpin ? stopAutoSpin : startAutoSpin}
          disabled={isSpinning && !isAutoSpin}
          className={`w-full py-2 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAutoSpin
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white'
          }`}
          whileHover={{ scale: isSpinning && !isAutoSpin ? 1 : 1.02 }}
          whileTap={{ scale: isSpinning && !isAutoSpin ? 1 : 0.98 }}
        >
          {isAutoSpin ? (
            <>
              <Square className="w-4 h-4" />
              <span>Parar Auto-Spin</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Iniciar Auto-Spin</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Saldo Atual */}
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-600/40 rounded-xl p-4 shadow-lg">
        <h3 className="text-gray-300 font-bold text-lg mb-2 flex items-center justify-center gap-2">
          💳 <span>SALDO</span>
        </h3>
        <motion.div 
          className="text-2xl font-bold text-center bg-black/20 rounded-lg py-2 px-3"
          key={balance}
          initial={{ scale: 1.1, color: balance >= 0 ? '#10b981' : '#ef4444' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.3 }}
        >
          R$ {balance.toFixed(2)}
        </motion.div>
      </div>
    </div>
  );
}