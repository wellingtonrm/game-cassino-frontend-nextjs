'use client';

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, SYMBOLS, LOSER_MESSAGES, getWinType, triggerHapticFeedback, showWinToast } from '@/stores/gameStore';
import type { GameResult } from '@/stores/gameStore';

// ===== CONFIGURAÇÕES =====
const ICON_HEIGHT = 80;
const GRID_SIZE = { rows: 3, cols: 3 };

// ===== COMPONENTES AUXILIARES =====
const WinningSound = () => (
  <audio autoPlay className="player" preload="none">
    <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
  </audio>
);

// ===== INTERFACES PARA SPINNER =====
interface SpinnerRef {
  reset: () => void;
}

interface SpinnerProps {
  symbols: string[];
  onFinish: (symbol: string) => void;
  isWinning?: boolean;
}

// ===== COMPONENTE SPINNER =====
const Spinner = forwardRef<SpinnerRef, SpinnerProps>(({ symbols, onFinish, isWinning }, ref) => {
  const [position, setPosition] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalSymbol, setFinalSymbol] = useState(symbols[0]);
  const [reelSymbols, setReelSymbols] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Criar uma sequência longa de símbolos para simular o rolo da slot machine
  useEffect(() => {
    const extendedSymbols = [];
    // Repetir símbolos múltiplas vezes para criar um rolo longo
    for (let i = 0; i < 20; i++) {
      extendedSymbols.push(...symbols);
    }
    setReelSymbols(extendedSymbols);
  }, [symbols]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (!isClient) return;
      
      setIsSpinning(true);
      
      // Duração da animação com variação para cada spinner
      const spinDuration = 2000 + Math.random() * 1500; // 2-3.5 segundos
      const finalIndex = Math.floor(Math.random() * symbols.length);
      
      // Calcular posição final para mostrar o símbolo correto
      const totalSpins = 15 + Math.floor(Math.random() * 10); // 15-25 voltas completas
      const finalPosition = -(totalSpins * symbols.length * ICON_HEIGHT + finalIndex * ICON_HEIGHT);
      
      // Animação suave com easing
      const startTime = Date.now();
      const startPosition = position;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function para desaceleração realista
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentPosition = startPosition + (finalPosition - startPosition) * easeOut;
        
        setPosition(currentPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setFinalSymbol(symbols[finalIndex]);
          setIsSpinning(false);
          onFinish(symbols[finalIndex]);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }));

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-lg border border-gray-600 shadow-inner">
      {/* Moldura superior e inferior para simular a janela da slot machine */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-700 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-gray-700 to-transparent z-10 pointer-events-none" />
      
      {/* Linha central de referência */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-yellow-400/30 transform -translate-y-0.5 z-10 pointer-events-none" />
      
      {/* Rolo de símbolos */}
      <div 
        className={`flex flex-col absolute left-0 right-0 transition-none ${
          isSpinning ? 'filter blur-[1px]' : ''
        }`}
        style={{
          transform: `translateY(${position}px)`,
          top: '50%',
          marginTop: `-${ICON_HEIGHT / 2}px`
        }}
      >
        {reelSymbols.map((symbol, index) => (
          <div 
            key={index}
            className="flex items-center justify-center text-2xl font-bold drop-shadow-lg"
            style={{ height: `${ICON_HEIGHT}px` }}
          >
            <span className={`transition-all duration-300 ${
              isWinning && !isSpinning && symbol === finalSymbol 
                ? 'text-yellow-400 scale-110 drop-shadow-[0_0_8px_rgba(255,255,0,0.8)]' 
                : 'text-white'
            }`}>
              {symbol}
            </span>
          </div>
        ))}
      </div>
      
      {/* Efeito de movimento durante o giro */}
      {isSpinning && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-blue-500/10 animate-pulse" />
          <div className="absolute top-1/4 left-0 right-0 h-px bg-white/20 animate-pulse" />
          <div className="absolute bottom-1/4 left-0 right-0 h-px bg-white/20 animate-pulse" />
        </>
      )}
      
      {/* Efeito de vitória */}
      {isWinning && !isSpinning && (
        <>
          <div className="absolute inset-0 bg-yellow-400/20 animate-pulse rounded-lg" />
          <div className="absolute inset-0 border border-yellow-400 rounded-lg animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-yellow-400 rounded-full animate-ping" />
        </>
      )}
      
      {/* Reflexo metálico */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-lg" />
    </div>
  );
});

Spinner.displayName = "Spinner";

// ===== COMPONENTE PRINCIPAL SLOT MACHINE =====
export default function SlotMachine() {
  const {
    isSpinning,
    winner,
    matches,
    loserMessage,
    soundEnabled,
    balance,
    betAmount,
    startSpin,
    finishSpin,
    setWinner,
    setMatches,
    setLoserMessage
  } = useGameStore();
  
  const spinnerRefs = useRef<Array<SpinnerRef | null>>(Array(9).fill(null));
  const symbolsArray = SYMBOLS.map(s => s.emoji);
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null);

  // ===== FUNÇÃO PARA LIDAR COM RESULTADO DOS SPINNERS =====
  const handleSpinnerFinish = useCallback((symbolIndex: number) => {
    const updated = [...matches, symbolIndex];
    setMatches(updated);

    if (updated.length === 3) {
    const allSame = updated.every((v) => v === updated[0]);
    const winAmount = allSame ? SYMBOLS[symbolIndex].multiplier * betAmount : 0;
      
    setTimeout(() => {
      setWinner(allSame);
      if (allSame) {
        // Vitória
        const result: GameResult = {
          symbols: [[SYMBOLS[symbolIndex].emoji, SYMBOLS[symbolIndex].emoji, SYMBOLS[symbolIndex].emoji]],
          isWin: true,
          winAmount,
          winningLines: [0],
          winType: getWinType(winAmount),
          timestamp: new Date(),
          betAmount: betAmount
        };
        
        finishSpin(result);
        showWinToast(result);
        triggerHapticFeedback('heavy');
      } else {
        // Derrota
        const getRandomLoserMessage = () => {
          if (typeof window === 'undefined') {
            return LOSER_MESSAGES[0]; // Mensagem padrão para SSR
          }
          return LOSER_MESSAGES[Math.floor(Math.random() * LOSER_MESSAGES.length)];
        };
        
        setLoserMessage(getRandomLoserMessage());
        
        const result: GameResult = {
          symbols: [updated.map(idx => SYMBOLS[idx].emoji)],
          isWin: false,
          winAmount: 0,
          winningLines: [],
          winType: 'regular',
          timestamp: new Date(),
          betAmount: betAmount
        };
        
        finishSpin(result);
      }
    }, 0);
    }
  }, [matches, betAmount, finishSpin, setWinner, setMatches, setLoserMessage]);

  // ===== FUNÇÃO PRINCIPAL DE GIRO =====
  const spin = useCallback(() => {
    if (!startSpin()) return;

    // Iniciar animação dos spinners com timing escalonado
    spinnerRefs.current.forEach((spinner, index) => {
      if (spinner) {
        // Delay escalonado: primeira coluna para primeiro, última para por último
        const column = index % 3;
        const delayMs = column * 500; // 0ms, 500ms, 1000ms
        
        setTimeout(() => {
          spinner.reset();
        }, delayMs);
      }
    });
  }, [startSpin]);

  // Cleanup do auto-spin
  useEffect(() => {
    return () => {
      if (autoSpinRef.current) {
        clearTimeout(autoSpinRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Moldura Externa da Slot Machine */}
      <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 rounded-2xl border-2 border-gray-600 shadow-2xl">
        {/* Reflexos metálicos na moldura */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none" />
        <div className="absolute top-2 left-2 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
        
        {/* Painel Superior */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black font-bold text-lg text-center py-2 rounded-lg mb-3 shadow-inner">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🎰</span>
            <span>SLOT MACHINE</span>
            <span className="text-xl">🎰</span>
          </div>
        </div>
        
        {/* Linhas de Pagamento Decorativas */}
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((line) => (
            <div key={line} className="flex items-center gap-1 text-xs text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span>L{line}</span>
            </div>
          ))}
        </div>
        
        {/* Grade de Spinners */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Array.from({ length: 9 }, (_, index) => {
            const isWinningSpinner = winner === true && matches.length === 3 && matches.every(m => m === matches[0]);
            return (
              <div key={index} className="relative">
                {/* Moldura individual do spinner */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg" />
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  <div className="w-20 h-20">
                    <Spinner
                      ref={(el) => { spinnerRefs.current[index] = el; }}
                      symbols={symbolsArray}
                      onFinish={(symbol) => {
                        const symbolIndex = SYMBOLS.findIndex(s => s.emoji === symbol);
                        handleSpinnerFinish(symbolIndex);
                      }}
                      isWinning={isWinningSpinner}
                    />
                  </div>
                </div>
                {/* Reflexo metálico individual */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-lg pointer-events-none" />
              </div>
            );
          })}
        </div>
        
        {/* Painel Inferior com LEDs */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg p-2">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${
                  isSpinning 
                    ? 'bg-blue-400 animate-pulse' 
                    : winner 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Mensagens de Resultado */}
      {winner !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-4 py-2 rounded-lg border-2 font-bold text-sm shadow-lg ${
            winner
              ? 'bg-green-500/90 border-green-400 text-white'
              : 'bg-red-500/90 border-red-400 text-white'
          }`}
        >
          {winner ? 'VOCÊ GANHOU! 🎉' : loserMessage}
        </motion.div>
      )}
      
      {/* Som de Vitória */}
      {winner && soundEnabled && <WinningSound />}
      
      {/* Botão de Spin Manual */}
      <div className="mt-4 flex justify-center">
        <motion.button
          onClick={spin}
          disabled={isSpinning || balance < betAmount}
          className={`px-8 py-4 rounded-xl font-bold text-xl transition-all duration-200 flex items-center gap-3 shadow-lg ${
            isSpinning || balance < betAmount
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white hover:shadow-xl'
          }`}
          whileHover={{ scale: isSpinning || balance < betAmount ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning || balance < betAmount ? 1 : 0.95 }}
        >
          {isSpinning ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>GIRANDO...</span>
            </>
          ) : (
            <>
              <span>🎰</span>
              <span>GIRAR</span>
              <span className="text-sm opacity-80">(R$ {betAmount.toFixed(2)})</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}