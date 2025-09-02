
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================
// Interfaces e tipos para o jogo Plinko
// ============================================================================
export interface PlinkoResult {
  multiplier: number;
  payout: number;
  betAmount: number;
  timestamp: Date;
  ballPath?: { x: number; y: number }[];
}

export interface PlinkoStats {
  totalGames: number;
  totalWinnings: number;
  totalBets: number;
  netProfit: number;
  maxMultiplier: number;
  averageMultiplier: number;
  winRate: number;
}

export interface PlinkoSettings {
  mode: 'manual' | 'auto';
  betAmount: number;
  lines: number;
  risk: 'low' | 'average' | 'high';
  autoSpinCount: number;
  maxAutoSpins: number;
  ballWeight: number;
  ballFriction: number;
  ballSize: number;
}

interface PlinkoState {
  // Estado do jogo
  balance: number;
  isPlaying: boolean;
  animating: boolean;
  currentResult: PlinkoResult | null;
  history: PlinkoResult[];
  soundEnabled: boolean;
  
  // Configurações
  settings: PlinkoSettings;
  
  // Auto-play
  isAutoPlay: boolean;
  autoPlayRunning: boolean;
  
  // Ações
  setBalance: (balance: number) => void;
  addCredits: (amount: number) => void;
  deductBet: (amount: number) => boolean;
  setIsPlaying: (playing: boolean) => void;
  setAnimating: (animating: boolean) => void;
  toggleSound: () => void;
  
  // Configurações
  updateSettings: (settings: Partial<PlinkoSettings>) => void;
  setBetAmount: (amount: number) => void;
  setRiskLevel: (risk: 'low' | 'average' | 'high') => void;
  setGameMode: (mode: 'manual' | 'auto') => void;
  setBallWeight: (weight: number) => void;
  setBallFriction: (friction: number) => void;
  setBallSize: (size: number) => void;
  
  // Jogabilidade
  startGame: () => boolean;
  finishGame: (result: PlinkoResult) => void;
  
  // Auto-play
  startAutoPlay: () => void;
  stopAutoPlay: () => void;
  incrementAutoPlayCount: () => void;
  resetAutoPlay: () => void;
  
  // Estatísticas
  getStats: () => PlinkoStats;
  clearHistory: () => void;
  
  // Utilitários
  canAffordBet: () => boolean;
  getMaxBet: () => number;
  formatBalance: (amount: number) => string;
}

// ============================================================================
// CONFIGURAÇÕES PADRÃO
// ============================================================================
// Configurações padrão do jogo Plinko
// ============================================================================
export const DEFAULT_SETTINGS: PlinkoSettings = {
  mode: 'manual',
  betAmount: 10,
  lines: 12,
  risk: 'average',
  autoSpinCount: 0,
  maxAutoSpins: 10,
  ballWeight: 1.0,
  ballFriction: 0.1,
  ballSize: 6,
};

export const RISK_MULTIPLIERS = {
  low: { min: 0.2, max: 5.0 },
  average: { min: 0.1, max: 10.0 },
  high: { min: 0.05, max: 50.0 }
};

export const MAX_HISTORY = 100;
export const INITIAL_BALANCE = 200;

// ============================================================================
// STORE ZUSTAND - GERENCIAMENTO DE ESTADO
// ============================================================================
// Store principal do jogo Plinko usando Zustand
// Gerencia estado completo incluindo saldo, configurações e histórico
// ============================================================================
export const usePlinkoStore = create<PlinkoState>()(persist(
  (set, get) => ({
    // Estado inicial
    balance: INITIAL_BALANCE,
    isPlaying: false,
    animating: false,
    currentResult: null,
    history: [],
    soundEnabled: true,
    settings: DEFAULT_SETTINGS,
    isAutoPlay: false,
    autoPlayRunning: false,
    
    // Ações básicas
    setBalance: (balance: number) => {
      set({ balance: Math.max(0, balance) });
    },
    
    addCredits: (amount: number) => {
      set((state) => ({ balance: state.balance + amount }));
      toast.success(`+${amount} créditos adicionados!`);
    },
    
    deductBet: (amount: number) => {
      const state = get();
      if (state.balance >= amount) {
        set({ balance: state.balance - amount });
        return true;
      }
      return false;
    },
    
    setIsPlaying: (playing: boolean) => {
      set({ isPlaying: playing });
    },
    
    setAnimating: (animating: boolean) => {
      set({ animating });
    },
    
    // Jogabilidade
    startGame: () => {
      const state = get();
      
      console.log('🏁 startGame called - checking conditions:');
      console.log('  - isPlaying:', state.isPlaying);
      console.log('  - animating:', state.animating);
      console.log('  - canAffordBet:', state.canAffordBet());
      console.log('  - betAmount:', state.settings.betAmount);
      console.log('  - balance:', state.balance);
      
      if (state.isPlaying || state.animating || !state.canAffordBet()) {
        console.log('❌ startGame failed - condition check:');
        console.log('  - isPlaying:', state.isPlaying, '(should be false)');
        console.log('  - animating:', state.animating, '(should be false)');
        console.log('  - canAffordBet:', state.canAffordBet(), '(should be true)');
        
        if (!state.canAffordBet()) {
          console.log('💰 Insufficient balance - showing toast');
          toast.error('Saldo insuficiente para esta aposta!');
        }
        return false;
      }
      
      console.log('✅ All startGame conditions met - proceeding...');
      
      // Deduct bet amount
      console.log('💰 Deducting bet amount:', state.settings.betAmount);
      const betDeducted = state.deductBet(state.settings.betAmount);
      
      if (!betDeducted) {
        console.log('❌ Failed to deduct bet - this should not happen if canAffordBet is true');
        toast.error('Erro ao deduzir a aposta. Tente novamente.');
        return false;
      }
      
      console.log('✅ Bet deducted successfully - setting game state');
      set({ 
        isPlaying: true, 
        animating: true, // Set animating to true here
        currentResult: null 
      });
      
      console.log('🎯 Game state updated - startGame completed successfully');
      return true;
    },
    
    toggleSound: () => {
      set((state) => ({ soundEnabled: !state.soundEnabled }));
    },
    
    // Configurações
    updateSettings: (newSettings: Partial<PlinkoSettings>) => {
      set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }));
    },
    
    setBetAmount: (amount: number) => {
      const state = get();
      const maxBet = state.getMaxBet();
      const validAmount = Math.max(1, Math.min(maxBet, amount));
      
      set((state) => ({
        settings: { ...state.settings, betAmount: validAmount }
      }));
    },
    
    setRiskLevel: (risk: 'low' | 'average' | 'high') => {
      set((state) => ({
        settings: { ...state.settings, risk }
      }));
    },
    
    setGameMode: (mode: 'manual' | 'auto') => {
      set((state) => ({
        settings: { ...state.settings, mode }
      }));
      
      // Para o auto-play se mudou para manual
      if (mode === 'manual') {
        get().stopAutoPlay();
      }
    },
    
    setBallWeight: (weight: number) => {
      set((state) => ({
        settings: { ...state.settings, ballWeight: weight }
      }));
    },
    
    setBallFriction: (friction: number) => {
      set((state) => ({
        settings: { ...state.settings, ballFriction: friction }
      }));
    },
    
    setBallSize: (size: number) => {
      set((state) => ({
        settings: { ...state.settings, ballSize: size }
      }));
    },
    
    
    finishGame: (result: PlinkoResult) => {
      const state = get();
      
      // Validate result data to prevent undefined/NaN issues
      const safeResult: PlinkoResult = {
        multiplier: result.multiplier ?? 1.0,
        payout: result.payout ?? 0,
        betAmount: result.betAmount ?? state.settings.betAmount,
        timestamp: result.timestamp ?? new Date(),
        ballPath: result.ballPath
      };
      
      // Additional safety checks
      if (isNaN(safeResult.multiplier) || safeResult.multiplier < 0) {
        safeResult.multiplier = 1.0;
      }
      if (isNaN(safeResult.payout) || safeResult.payout < 0) {
        safeResult.payout = safeResult.betAmount * safeResult.multiplier;
      }
      
      console.log('🎯 finishGame called with result:', safeResult);
      
      // Adiciona o resultado ao histórico
      const newHistory = [safeResult, ...state.history].slice(0, MAX_HISTORY);
      
      // Adiciona os ganhos ao saldo
      const newBalance = state.balance + safeResult.payout;
      
      set({
        isPlaying: false,
        animating: false,
        currentResult: safeResult,
        history: newHistory,
        balance: newBalance
      });
      
      // Mostra toast de resultado
      if (safeResult.payout > 0) {
        const winType = safeResult.multiplier >= 50 ? 'mega' : 
                      safeResult.multiplier >= 10 ? 'big' : 'regular';
        
        const messages = {
          regular: `Vitória! ${safeResult.multiplier}x - +${safeResult.payout.toFixed(2)} créditos! 🎉`,
          big: `BIG WIN! ${safeResult.multiplier}x - +${safeResult.payout.toFixed(2)} créditos! 🔥`,
          mega: `MEGA WIN! ${safeResult.multiplier}x - +${safeResult.payout.toFixed(2)} créditos! 💎`
        };
        
        toast.success(messages[winType], {
          duration: winType === 'mega' ? 5000 : 3000
        });
      }
      
      // Auto-play logic
      if (state.isAutoPlay && state.autoPlayRunning) {
        state.incrementAutoPlayCount();
        
        // Verifica se deve continuar o auto-play
        const shouldContinue = 
          state.settings.autoSpinCount < state.settings.maxAutoSpins &&
          state.canAffordBet();
          
        if (shouldContinue) {
          // Continua o auto-play após um delay
          setTimeout(() => {
            if (get().autoPlayRunning) {
              get().startGame();
            }
          }, 1500);
        } else {
          state.stopAutoPlay();
        }
      }
    },
    
    // Auto-play
    startAutoPlay: () => {
      const state = get();
      
      if (!state.canAffordBet()) {
        toast.error('Saldo insuficiente para auto-play!');
        return;
      }
      
      set((state) => ({
        isAutoPlay: true,
        autoPlayRunning: true,
        settings: { ...state.settings, autoSpinCount: 0 }
      }));
      
      // Inicia o primeiro jogo
      get().startGame();
    },
    
    stopAutoPlay: () => {
      set({
        isAutoPlay: false,
        autoPlayRunning: false
      });
    },
    
    incrementAutoPlayCount: () => {
      set((state) => ({
        settings: {
          ...state.settings,
          autoSpinCount: state.settings.autoSpinCount + 1
        }
      }));
    },
    
    resetAutoPlay: () => {
      set((state) => ({
        settings: { ...state.settings, autoSpinCount: 0 }
      }));
    },
    
    // Estatísticas
    getStats: (): PlinkoStats => {
      const state = get();
      const { history } = state;
      
      if (history.length === 0) {
        return {
          totalGames: 0,
          totalWinnings: 0,
          totalBets: 0,
          netProfit: 0,
          maxMultiplier: 0,
          averageMultiplier: 0,
          winRate: 0
        };
      }
      
      const totalGames = history.length;
      const totalWinnings = history.reduce((sum, game) => sum + game.payout, 0);
      const totalBets = history.reduce((sum, game) => sum + game.betAmount, 0);
      const netProfit = totalWinnings - totalBets;
      const maxMultiplier = Math.max(...history.map(game => game.multiplier));
      const averageMultiplier = history.reduce((sum, game) => sum + game.multiplier, 0) / totalGames;
      const wins = history.filter(game => game.payout > 0).length;
      const winRate = (wins / totalGames) * 100;
      
      return {
        totalGames,
        totalWinnings,
        totalBets,
        netProfit,
        maxMultiplier,
        averageMultiplier,
        winRate
      };
    },
    
    clearHistory: () => {
      set({ history: [] });
    },
    
    // Utilitários
    canAffordBet: () => {
      const state = get();
      return state.balance >= state.settings.betAmount;
    },
    
    getMaxBet: () => {
      const state = get();
      const balance = state.balance;
      if (balance === null || balance === undefined || isNaN(balance) || balance < 0) {
        return 0;
      }
      return balance;
    },
    
    formatBalance: (amount: number | null | undefined) => {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.000000';
      }
      return amount.toFixed(6);
    }
  }),
  {
    name: 'plinko-game-state',
    partialize: (state) => ({
      balance: state.balance,
      history: state.history,
      soundEnabled: state.soundEnabled,
      settings: state.settings
    }),
    onRehydrateStorage: () => (state) => {
      // Ensure balance is never null/undefined and has a minimum value
      if (state && (state.balance === null || state.balance === undefined || state.balance < 0)) {
        state.balance = INITIAL_BALANCE;
      }
      // If balance is 0 and there's no game history, reset to initial balance
      if (state && state.balance === 0 && (!state.history || state.history.length === 0)) {
        state.balance = INITIAL_BALANCE;
      }
    }
  }
));

// ============================================================================
// FUNÇÕES AUXILIARES EXPORTADAS
// ============================================================================
// Funções utilitárias auxiliares para o jogo Plinko
// ============================================================================
export const calculateMultiplier = (riskLevel: 'low' | 'average' | 'high', pegHits: number): number => {
  const { min, max } = RISK_MULTIPLIERS[riskLevel];
  
  // Simulação baseada no número de pegs atingidos
  // Mais pegs = maior chance de multiplicadores extremos
  const baseMultiplier = Math.random() * (max - min) + min;
  
  // Ajuste baseado no nível de risco
  const riskFactor = riskLevel === 'high' ? 1.5 : riskLevel === 'low' ? 0.7 : 1.0;
  
  return Math.round((baseMultiplier * riskFactor) * 100) / 100;
};

export const triggerHapticFeedback = (pattern: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [50],
      medium: [100, 50, 100],
      heavy: [200, 100, 200, 100, 200]
    };
    navigator.vibrate(patterns[pattern]);
  }
};

export const playSound = (type: 'drop' | 'hit' | 'win' | 'lose', soundEnabled: boolean = true) => {
  if (!soundEnabled || typeof window === 'undefined') return;
  
  // Implementação de sons seria aqui
  // Por agora, apenas haptic feedback
  switch (type) {
    case 'drop':
      triggerHapticFeedback('light');
      break;
    case 'hit':
      triggerHapticFeedback('light');
      break;
    case 'win':
      triggerHapticFeedback('heavy');
      break;
    case 'lose':
      triggerHapticFeedback('medium');
      break;
  }
};