import { create } from 'zustand';

interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isActive: boolean;
}

interface GameSettings {
  betAmount: number;
  risk: 'low' | 'medium' | 'high';
}

interface PlinkoGameState {
  // Estado do jogo
  isPlaying: boolean;
  isAnimating: boolean;
  balls: Ball[];
  balance: number;
  settings: GameSettings;
  
  // Controle de lançamento
  launchPosition: number;
  
  // Actions
  setIsPlaying: (playing: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
  addBall: (ball: Omit<Ball, 'id'>) => void;
  updateBall: (id: string, updates: Partial<Ball>) => void;
  removeBall: (id: string) => void;
  clearBalls: () => void;
  setLaunchPosition: (position: number) => void;
  setBalance: (balance: number) => void;
  setBetAmount: (amount: number) => void;
  setRiskLevel: (risk: 'low' | 'medium' | 'high') => void;
  
  // Controle de jogo
  startGame: () => void;
  endGame: () => void;
  launchBall: () => void;
  
  // Utilidades
  formatBalance: (amount: number) => string;
  getMaxBet: () => number;
  canAffordBet: () => boolean;
}

export const usePlinkoStore = create<PlinkoGameState>((set, get) => ({
  // Estado inicial
  isPlaying: false,
  isAnimating: false,
  balls: [],
  balance: 1000,
  settings: {
    betAmount: 10,
    risk: 'medium',
  },
  launchPosition: 0.5,

  // Actions
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  
  setIsAnimating: (animating) => set({ isAnimating: animating }),
  
  addBall: (ball) => {
    const newBall: Ball = {
      ...ball,
      id: `ball-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    set((state) => ({
      balls: [...state.balls, newBall],
    }));
  },
  
  updateBall: (id, updates) => {
    set((state) => ({
      balls: state.balls.map((ball) =>
        ball.id === id ? { ...ball, ...updates } : ball
      ),
    }));
  },
  
  removeBall: (id) => {
    set((state) => ({
      balls: state.balls.filter((ball) => ball.id !== id),
    }));
  },
  
  clearBalls: () => set({ balls: [] }),
  
  setLaunchPosition: (position) => set({ launchPosition: position }),
  
  setBalance: (balance) => set({ balance }),
  
  setBetAmount: (amount) => set((state) => ({
    settings: { ...state.settings, betAmount: amount }
  })),
  
  setRiskLevel: (risk) => set((state) => ({
    settings: { ...state.settings, risk }
  })),
  
  // Controle de jogo
  startGame: () => {
    set({ isPlaying: true, isAnimating: false });
  },
  
  endGame: () => {
    set({ isPlaying: false, isAnimating: false });
  },
  
  launchBall: () => {
    const { launchPosition, isAnimating, settings, balance } = get();
    
    if (isAnimating || balance < settings.betAmount) return;
    
    const newBall = {
      x: launchPosition,
      y: 0,
      vx: 0,
      vy: 0,
      isActive: true,
    };
    
    get().addBall(newBall);
    set({ isAnimating: true, balance: balance - settings.betAmount });
  },
  
  // Utilidades
  formatBalance: (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toFixed(2);
  },
  
  getMaxBet: () => {
    return Math.floor(get().balance);
  },
  
  canAffordBet: () => {
    const { balance, settings } = get();
    return balance >= settings.betAmount;
  },
}));