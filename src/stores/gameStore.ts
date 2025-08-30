import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// ===== INTERFACES E TIPOS =====
export interface SlotSymbol {
  emoji: string;
  weight: number;
  multiplier: number;
}

export interface GameResult {
  symbols: string[][];
  isWin: boolean;
  winAmount: number;
  winningLines: number[];
  winType: 'regular' | 'big' | 'mega';
  timestamp: Date;
  betAmount: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  winRate: number;
  netProfit: number;
  bigWins: number;
  megaWins: number;
}

interface GameState {
  // Estado do jogo
  balance: number;
  isSpinning: boolean;
  currentResult: GameResult | null;
  history: GameResult[];
  soundEnabled: boolean;
  
  // Configurações de aposta
  betAmount: number;
  
  // Auto-spin
  isAutoSpin: boolean;
  autoSpinCount: number;
  maxAutoSpins: number;
  
  // Estados da animação
  winner: boolean | null;
  matches: number[];
  loserMessage: string;
  
  // Ações
  setBetAmount: (amount: number) => void;
  addCredits: (amount: number) => void;
  toggleSound: () => void;
  spin: (betAmount: number) => void;
  startSpin: () => boolean;
  finishSpin: (result: GameResult) => void;
  setWinner: (winner: boolean | null) => void;
  setMatches: (matches: number[]) => void;
  setLoserMessage: (message: string) => void;
  startAutoSpin: () => void;
  stopAutoSpin: () => void;
  incrementAutoSpinCount: () => void;
  resetAutoSpin: () => void;
  getStats: () => GameStats;
}

// ===== CONFIGURAÇÕES DO JOGO =====
export const SYMBOLS: SlotSymbol[] = [
  { emoji: '💎', weight: 5, multiplier: 50 },
  { emoji: '⭐', weight: 8, multiplier: 30 },
  { emoji: '💰', weight: 15, multiplier: 25 },
  { emoji: '🔔', weight: 25, multiplier: 15 },
  { emoji: '🍒', weight: 12, multiplier: 12 },
  { emoji: '🍊', weight: 15, multiplier: 10 },
  { emoji: '🍋', weight: 20, multiplier: 8 }
];

export const LOSER_MESSAGES = [
  "Quase lá!",
  "Tente novamente!",
  "Ops! Perdeu!",
  "Não desista!",
  "A sorte está chegando",
  "Próxima vez!",
  "Continue tentando",
  "Você consegue!",
  "Mais uma vez!",
  "A vitória vem aí!"
];

export const MAX_HISTORY = 50;

// ===== STORE ZUSTAND =====
export const useGameStore = create<GameState>()(persist(
    (set, get) => ({
      // Estado inicial
      balance: 1000,
      isSpinning: false,
      currentResult: null,
      history: [],
      soundEnabled: true,
      betAmount: 10,
      isAutoSpin: false,
      autoSpinCount: 0,
      maxAutoSpins: 10,
      winner: null,
      matches: [],
      loserMessage: "",
      
      // Ações
      setBetAmount: (amount: number) => {
        set({ betAmount: amount });
      },
      
      addCredits: (amount: number) => {
        set((state) => ({ balance: state.balance + amount }));
        toast.success(`+${amount} créditos adicionados!`);
      },
      
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
      
      spin: (betAmount: number) => {
        const state = get();
        if (state.isSpinning || state.balance < betAmount) {
          if (state.balance < betAmount) {
            toast.error('Saldo insuficiente para apostar!');
          }
          return;
        }
        
        // Atualizar valor da aposta
        set({ betAmount });
        
        // Iniciar spin
        state.startSpin();
      },
      
      startSpin: () => {
        const state = get();
        if (state.isSpinning || state.balance < state.betAmount) {
          if (state.balance < state.betAmount) {
            toast.error('Saldo insuficiente para apostar!');
          }
          return false;
        }
        
        set({
          isSpinning: true,
          balance: state.balance - state.betAmount,
          winner: null,
          matches: [],
          loserMessage: ""
        });
        
        return true;
      },
      
      finishSpin: (result: GameResult) => {
        set((state) => ({
          isSpinning: false,
          currentResult: result,
          balance: state.balance + result.winAmount,
          history: [result, ...state.history].slice(0, MAX_HISTORY)
        }));
      },
      
      setWinner: (winner: boolean | null) => {
        set({ winner });
      },
      
      setMatches: (matches: number[]) => {
        set({ matches });
      },
      
      setLoserMessage: (message: string) => {
        set({ loserMessage: message });
      },
      
      startAutoSpin: () => {
        const state = get();
        if (state.balance < state.betAmount) {
          set({ isAutoSpin: false });
          return;
        }
        
        set({ isAutoSpin: true, autoSpinCount: 0 });
      },
      
      stopAutoSpin: () => {
        set({ isAutoSpin: false, autoSpinCount: 0 });
      },
      
      incrementAutoSpinCount: () => {
        set((state) => ({ autoSpinCount: state.autoSpinCount + 1 }));
      },
      
      resetAutoSpin: () => {
        set({ autoSpinCount: 0 });
      },
      
      getStats: (): GameStats => {
        const state = get();
        const totalGames = state.history.length;
        const wins = state.history.filter(game => game.isWin).length;
        const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
        const totalWinnings = state.history.reduce((sum, game) => sum + game.winAmount, 0);
        const totalBets = state.history.reduce((sum, game) => sum + game.betAmount, 0);
        const netProfit = totalWinnings - totalBets;
        const bigWins = state.history.filter(game => game.winType === 'big').length;
        const megaWins = state.history.filter(game => game.winType === 'mega').length;
        
        return { totalGames, wins, winRate, netProfit, bigWins, megaWins };
      }
    }),
    {
      name: 'neon-slots-state',
      partialize: (state) => ({
        balance: state.balance,
        history: state.history,
        soundEnabled: state.soundEnabled,
        betAmount: state.betAmount
      })
    }
  )
);

// ===== FUNÇÕES AUXILIARES =====
export const getRandomSymbol = (): string => {
  if (typeof window === 'undefined') {
    return '🎰'; // Símbolo padrão para SSR
  }
  
  const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const symbol of SYMBOLS) {
    random -= symbol.weight;
    if (random <= 0) return symbol.emoji;
  }
  return SYMBOLS[SYMBOLS.length - 1].emoji;
};

export const getWinType = (amount: number): 'regular' | 'big' | 'mega' => {
  if (amount >= 100) return 'mega';
  if (amount >= 50) return 'big';
  return 'regular';
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

export const showWinToast = (result: GameResult) => {
  const messages = {
    regular: `Vitória! +${result.winAmount} créditos! 🎉`,
    big: `BIG WIN! +${result.winAmount} créditos! 🔥`,
    mega: `MEGA WIN! +${result.winAmount} créditos! 💎`
  };

  toast.success(messages[result.winType], {
    duration: result.winType === 'mega' ? 5000 : 3000,
    className: `toast-${result.winType}`
  });
};