'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Volume2, VolumeX, Plus, Trophy, TrendingUp, History, Star } from 'lucide-react';
import LayoutGame from '@/components/LayoutGame';

// ===== INTERFACES E TIPOS =====
interface SlotSymbol {
  emoji: string;
  weight: number;
  multiplier: number;
}

interface GameResult {
  symbols: string[][];
  isWin: boolean;
  winAmount: number;
  winningLines: number[];
  winType: 'regular' | 'big' | 'mega';
  timestamp: Date;
  betAmount: number;
}

interface GameState {
  balance: number;
  isSpinning: boolean;
  currentResult: GameResult | null;
  history: GameResult[];
  soundEnabled: boolean;
}

interface GameStats {
  totalGames: number;
  wins: number;
  winRate: number;
  netProfit: number;
  bigWins: number;
  megaWins: number;
}

// ===== CONFIGURAÇÕES DO JOGO =====
const SYMBOLS: SlotSymbol[] = [
  { emoji: '💎', weight: 5, multiplier: 50 },
  { emoji: '⭐', weight: 8, multiplier: 30 },
  { emoji: '💰', weight: 15, multiplier: 25 },
  { emoji: '🔔', weight: 25, multiplier: 15 },
  { emoji: '🍒', weight: 12, multiplier: 12 },
  { emoji: '🍊', weight: 15, multiplier: 10 },
  { emoji: '🍋', weight: 20, multiplier: 8 }
];

const GRID_SIZE = { rows: 3, cols: 3 };
const SPIN_DURATION = 2500;
const MAX_HISTORY = 50;

// ===== COMPONENTE PRINCIPAL =====
export default function NeonSlots() {
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState<GameState>({
    balance: 1000,
    isSpinning: false,
    currentResult: null,
    history: [],
    soundEnabled: true
  });

  // ===== FUNÇÕES AUXILIARES =====
  const getRandomSymbol = useCallback((): string => {
    const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of SYMBOLS) {
      random -= symbol.weight;
      if (random <= 0) return symbol.emoji;
    }
    return SYMBOLS[SYMBOLS.length - 1].emoji;
  }, []);

  const generateGrid = useCallback((): string[][] => {
    return Array(GRID_SIZE.rows).fill(null).map(() => 
      Array(GRID_SIZE.cols).fill(null).map(() => getRandomSymbol())
    );
  }, [getRandomSymbol]);

  const checkWinningLines = useCallback((grid: string[][]): { lines: number[], amount: number } => {
    const winningLines: number[] = [];
    let totalAmount = 0;

    // Verificar linhas horizontais (0, 1, 2)
    for (let row = 0; row < GRID_SIZE.rows; row++) {
      if (grid[row][0] === grid[row][1] && grid[row][1] === grid[row][2]) {
        winningLines.push(row);
        const symbol = SYMBOLS.find(s => s.emoji === grid[row][0]);
        if (symbol) totalAmount += symbol.multiplier * betAmount;
      }
    }

    // Verificar diagonais (3 = principal, 4 = secundária)
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      winningLines.push(3);
      const symbol = SYMBOLS.find(s => s.emoji === grid[0][0]);
      if (symbol) totalAmount += Math.floor(symbol.multiplier * betAmount * 1.5); // Bônus diagonal
    }

    if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      winningLines.push(4);
      const symbol = SYMBOLS.find(s => s.emoji === grid[0][2]);
      if (symbol) totalAmount += Math.floor(symbol.multiplier * betAmount * 1.5); // Bônus diagonal
    }

    return { lines: winningLines, amount: totalAmount };
  }, []);

  const getWinType = useCallback((amount: number): 'regular' | 'big' | 'mega' => {
    if (amount >= 100) return 'mega';
    if (amount >= 50) return 'big';
    return 'regular';
  }, []);

  const triggerHapticFeedback = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100, 50, 100],
        heavy: [200, 100, 200, 100, 200]
      };
      navigator.vibrate(patterns[pattern]);
    }
  }, []);

  const showWinToast = useCallback((result: GameResult) => {
    const messages = {
      regular: `Vitória! +${result.winAmount} créditos! 🎉`,
      big: `BIG WIN! +${result.winAmount} créditos! 🔥`,
      mega: `MEGA WIN! +${result.winAmount} créditos! 💎`
    };

    toast.success(messages[result.winType], {
      duration: result.winType === 'mega' ? 5000 : 3000,
      className: `toast-${result.winType}`
    });
  }, []);

  // ===== FUNÇÃO PRINCIPAL DE GIRO =====
  const spin = useCallback(async () => {
    if (gameState.isSpinning || gameState.balance < betAmount) {
      if (gameState.balance < betAmount) {
        toast.error('Saldo insuficiente para apostar!');
      }
      return;
    }

    setGameState(prev => ({
      ...prev,
      isSpinning: true,
      balance: prev.balance - betAmount
    }));

    // Simular duração do giro
    await new Promise(resolve => setTimeout(resolve, SPIN_DURATION));

    const newGrid = generateGrid();
    const { lines, amount } = checkWinningLines(newGrid);
    const isWin = lines.length > 0;
    const winType = isWin ? getWinType(amount) : 'regular';

    const result: GameResult = {
      symbols: newGrid,
      isWin,
      winAmount: amount,
      winningLines: lines,
      winType,
      timestamp: new Date(),
      betAmount: betAmount
    };

    setGameState(prev => {
      const newHistory = [result, ...prev.history].slice(0, MAX_HISTORY);
      const newBalance = prev.balance + (isWin ? amount : 0);
      
      return {
        ...prev,
        isSpinning: false,
        currentResult: result,
        history: newHistory,
        balance: newBalance
      };
    });

    // Feedback para vitórias
    if (isWin) {
      showWinToast(result);
      triggerHapticFeedback(winType === 'mega' ? 'heavy' : winType === 'big' ? 'medium' : 'light');
    }
  }, [gameState.isSpinning, gameState.balance, generateGrid, checkWinningLines, getWinType, showWinToast, triggerHapticFeedback]);

  // ===== FUNÇÕES DE CONTROLE =====
  const addCredits = useCallback((amount: number) => {
    setGameState(prev => ({ ...prev, balance: prev.balance + amount }));
    toast.success(`+${amount} créditos adicionados!`);
  }, []);

  const toggleSound = useCallback(() => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // ===== ESTATÍSTICAS CALCULADAS =====
  const stats: GameStats = useMemo(() => {
    const totalGames = gameState.history.length;
    const wins = gameState.history.filter(game => game.isWin).length;
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const totalWinnings = gameState.history.reduce((sum, game) => sum + game.winAmount, 0);
    const totalBets = gameState.history.reduce((sum, game) => sum + game.betAmount, 0);
    const netProfit = totalWinnings - totalBets;
    const bigWins = gameState.history.filter(game => game.winType === 'big').length;
    const megaWins = gameState.history.filter(game => game.winType === 'mega').length;

    return { totalGames, wins, winRate, netProfit, bigWins, megaWins };
  }, [gameState.history]);

  // ===== PERSISTÊNCIA =====
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('neon-slots-state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setGameState(prev => ({ ...prev, ...parsed, isSpinning: false }));
        } catch (error) {
          console.error('Erro ao carregar estado salvo:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        balance: gameState.balance,
        history: gameState.history,
        soundEnabled: gameState.soundEnabled
      };
      localStorage.setItem('neon-slots-state', JSON.stringify(stateToSave));
    }
  }, [gameState.balance, gameState.history, gameState.soundEnabled]);

  // Mock data for chat messages
  const chatMessages = [
    { user: 'Player1', message: 'Grande vitória no slot!', time: '10:30', type: 'user' as const },
    { user: 'Player2', message: 'Alguém sabe a melhor estratégia?', time: '10:32', type: 'user' as const },
    { user: 'Player3', message: 'Acabei de ganhar 500 créditos!', time: '10:35', type: 'user' as const }
  ]

  // ===== RENDER =====
  return (
    <LayoutGame chatMessages={chatMessages}>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Layout Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controles */}
            <div className="space-y-6">
              {/* Valor da Rodada */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-yellow-500/50 rounded-xl p-6">
                <div className="text-center">
                  <h3 className="text-yellow-400 font-bold text-lg mb-4">🎯 VALOR DA RODADA</h3>
                  <div className="space-y-4">
                    <motion.div 
                      className="text-3xl font-bold text-white"
                      key={betAmount}
                      initial={{ scale: 1.1, color: '#10b981' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                       {betAmount.toFixed(2)}
                     </motion.div>
                    <input
                       type="range"
                       min="0.5"
                       max="10"
                       step="0.5"
                       value={betAmount}
                       onChange={(e) => setBetAmount(parseFloat(e.target.value))}
                       className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                       style={{
                         background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((betAmount - 0.5) / 9.5) * 100}%, #374151 ${((betAmount - 0.5) / 9.5) * 100}%, #374151 100%)`
                       }}
                     />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0,50</span>
                      <span>10,00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adicionar Créditos */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-green-500/50 rounded-xl p-6">
                <h3 className="text-green-400 font-bold text-lg mb-4 text-center">💳 ADICIONAR CRÉDITOS</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[50, 100, 200, 500].map(amount => (
                    <motion.button
                      key={amount}
                      onClick={() => addCredits(amount)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      +{amount}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Configurações */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/50 rounded-xl p-6">
                <h3 className="text-purple-400 font-bold text-lg mb-4 text-center">⚙️ CONFIGURAÇÕES</h3>
                <motion.button
                  onClick={toggleSound}
                  className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                    gameState.soundEnabled 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {gameState.soundEnabled ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
                  {gameState.soundEnabled ? 'Som Ligado' : 'Som Desligado'}
                </motion.button>
              </div>
            </div>

            {/* Máquina de Slot */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm border-2 border-yellow-500/50 rounded-2xl p-8"
                animate={gameState.isSpinning ? { 
                  boxShadow: ['0 0 30px #fbbf24', '0 0 60px #f59e0b', '0 0 30px #fbbf24'] 
                } : {}}
                transition={{ duration: 0.8, repeat: gameState.isSpinning ? Infinity : 0 }}
              >
                {/* Grade 3x3 - Maior */}
                <div className="grid grid-cols-3 gap-6 mb-8 max-w-lg mx-auto">
                  {gameState.currentResult?.symbols.map((row, rowIndex) => 
                    row.map((symbol, colIndex) => {
                      const isWinningSymbol = gameState.currentResult?.winningLines.some(line => {
                        if (line < 3) return line === rowIndex;
                        if (line === 3) return rowIndex === colIndex;
                        if (line === 4) return rowIndex + colIndex === 2;
                        return false;
                      });

                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square bg-gray-700 rounded-xl flex items-center justify-center text-6xl border-2 ${
                            isWinningSymbol 
                              ? 'border-green-400 shadow-lg shadow-green-400/50' 
                              : 'border-gray-600'
                          }`}
                          animate={gameState.isSpinning ? {
                            y: [0, -10, 0],
                            rotateY: [0, 180, 360]
                          } : isWinningSymbol ? {
                            scale: [1, 1.1, 1],
                            boxShadow: ['0 0 20px #10b981', '0 0 40px #10b981', '0 0 20px #10b981']
                          } : {}}
                          transition={{
                            duration: gameState.isSpinning ? 0.3 + (rowIndex * colIndex * 0.1) : 0.6,
                            repeat: gameState.isSpinning ? Infinity : isWinningSymbol ? Infinity : 0
                          }}
                        >
                          {symbol}
                        </motion.div>
                      );
                    })
                  ) || Array(9).fill(null).map((_, index) => (
                    <motion.div
                      key={index}
                      className="aspect-square bg-gray-700 rounded-xl flex items-center justify-center text-6xl border-2 border-gray-600"
                      animate={gameState.isSpinning ? {
                        y: [0, -10, 0],
                        rotateY: [0, 180, 360]
                      } : {}}
                      transition={{
                        duration: 0.3 + (Math.floor(index / 3) * (index % 3) * 0.1),
                        repeat: gameState.isSpinning ? Infinity : 0
                      }}
                    >
                      🎰
                    </motion.div>
                  ))}
                </div>

                {/* Informações da Aposta */}
                <div className="text-center mb-8">
                  <p className="text-gray-300 text-xl">
                    Aposta: <span className="text-yellow-400 font-bold">{betAmount.toFixed(2)} créditos</span>
                  </p>
                  {gameState.currentResult?.isWin && (
                    <motion.p 
                      className="text-green-400 font-bold text-2xl mt-3"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      Ganhou: +{gameState.currentResult.winAmount} créditos!
                    </motion.p>
                  )}
                </div>

                {/* Botão de Giro */}
                <div className="text-center">
                  <motion.button
                    onClick={spin}
                    disabled={gameState.isSpinning || gameState.balance < betAmount}
                    className={`px-16 py-5 rounded-full font-bold text-2xl transition-all duration-300 ${
                      gameState.isSpinning || gameState.balance < betAmount
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 text-white shadow-2xl'
                    }`}
                    whileHover={gameState.isSpinning || gameState.balance < betAmount ? {} : { scale: 1.05 }}
                    whileTap={gameState.isSpinning || gameState.balance < betAmount ? {} : { scale: 0.95 }}
                  >
                    {gameState.isSpinning ? '🎰 GIRANDO...' : '🎰 GIRAR'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

            {/* Histórico Lateral */}
            <div className="space-y-6">
              {/* Card de Informações */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/50 rounded-xl p-6">
                <h3 className="text-blue-400 font-bold text-lg mb-4 text-center">📊 ESTATÍSTICAS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Jogadas:</span>
                    <span className="text-white font-bold">{stats.totalGames}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Vitórias:</span>
                    <span className="text-green-400 font-bold">{stats.wins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Taxa:</span>
                    <span className="text-yellow-400 font-bold">{stats.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Lucro:</span>
                    <span className={`font-bold ${stats.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Histórico de Jogadas */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-500/50 rounded-xl p-6">
                <h3 className="text-gray-400 font-bold text-lg mb-4 text-center">📜 HISTÓRICO</h3>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {gameState.history.length === 0 ? (
                    <p className="text-gray-500 text-center text-sm">Nenhuma jogada ainda</p>
                  ) : (
                    gameState.history.slice(0, 20).map((game, index) => (
                      <motion.div
                        key={index}
                        className={`p-3 rounded-lg border text-sm ${
                          game.isWin 
                            ? 'bg-green-900/20 border-green-500/30' 
                            : 'bg-red-900/20 border-red-500/30'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg ${game.isWin ? 'text-green-400' : 'text-red-400'}`}>
                              {game.isWin ? '🎉' : '💸'}
                            </span>
                            <div>
                              <div className="text-gray-300 font-mono text-xs">
                                {game.symbols[0].join(' ')}
                              </div>
                              <div className="text-gray-500 text-xs">
                                #{stats.totalGames - index}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              game.isWin ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {game.isWin ? `+${game.winAmount}` : `-${game.betAmount}`}
                            </div>
                            {game.isWin && game.winType !== 'regular' && (
                              <div className="text-xs text-yellow-400 uppercase font-bold">
                                {game.winType}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </LayoutGame>
  );
}