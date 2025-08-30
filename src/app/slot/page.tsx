'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import SlotMachine from '@/components/SlotMachine';
import BetControls from '@/components/BetControls';
import GameStats from '@/components/GameStats';
import GameHistory from '@/components/GameHistory';
import { useGameStore } from '@/stores/gameStore';
import { TrendingUp, History } from 'lucide-react';

// ===== COMPONENTE PRINCIPAL =====
export default function SlotPage() {
  const { balance, isSpinning, currentResult, spin } = useGameStore();
  const [betAmount, setBetAmount] = useState(10);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mock data for chat messages
  const chatMessages = [
    { user: 'Player1', message: 'Grande vitória no slot!', time: '10:30', type: 'user' as const },
    { user: 'Player2', message: 'Alguém sabe a melhor estratégia?', time: '10:32', type: 'user' as const },
    { user: 'Player3', message: 'Acabei de ganhar 500 créditos!', time: '10:35', type: 'user' as const }
  ];

  // ===== HIDRATAÇÃO =====
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSpin = useCallback(() => {
    spin(betAmount);
  }, [spin, betAmount]);



  return (
      <div className="w-full min-h-screen">
        <div className="w-full mx-auto">
          {/* Container principal */}
          <div className=" rounded-lg p-4">
            
            {/* Painel superior com saldo */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="text-yellow-400 font-semibold text-lg">
                  💰 {balance.toLocaleString()} créditos
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    title="Estatísticas"
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                    title="Histórico"
                  >
                    <History className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Layout principal com grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Coluna esquerda - Controles */}
              <div className="lg:order-1">
                <BetControls />
              </div>

              {/* Coluna central - Slot Machine */}
              <div className="lg:order-2">
                <SlotMachine />
              </div>

              {/* Coluna direita - Estatísticas */}
              <div className="lg:order-3 space-y-4">
                {showStats && <GameStats />}
                {showHistory && <GameHistory />}
              </div>
            </div>

            {/* Resultado atual */}
            {currentResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                {currentResult.isWin ? (
                  <div className={`p-4 rounded-lg font-semibold ${
                    currentResult.winType === 'mega' ? 'bg-purple-500 text-white text-lg' :
                    currentResult.winType === 'big' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {currentResult.winType === 'mega' && '🎆 MEGA WIN! 🎆'}
                    {currentResult.winType === 'big' && '🔥 BIG WIN! 🔥'}
                    {currentResult.winType === 'regular' && '🎉 VITÓRIA! 🎉'}
                    <br />
                    Ganhou: +{currentResult.winAmount} créditos!
                  </div>
                ) : (
                  <div className="p-4 bg-white/10 text-gray-300 rounded-lg">
                    Tente novamente!
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
  );
}