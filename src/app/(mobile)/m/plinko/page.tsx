'use client';

import { useState, useCallback, useRef } from 'react';
import { Trophy, Clock, Home, Gamepad2, User, Wallet, TrendingUp, Play, Volume2, VolumeX, HelpCircle, Settings } from 'lucide-react';

export default function MobilePlinkoPage() {
  const [balance, setBalance] = useState(1567.00);
  const [betAmount, setBetAmount] = useState(0.000000002);
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [volatility, setVolatility] = useState<'custom'>('custom');
  const [rows, setRows] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [ballPath, setBallPath] = useState<{x: number, y: number}[]>([]);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [lastWinSlot, setLastWinSlot] = useState<number | null>(null);

  const multipliers = [1000, 130, 26, 9, 4, 2, 0.2, 2, 4, 9, 26, 130, 1000];
  const lastResults = [26.0, 130.0, 9.0, 1000.0];

  const handleBetAmountChange = useCallback((amount: number) => {
    setBetAmount(Math.min(amount, balance));
  }, [balance]);

  const handlePlay = useCallback(() => {
    if (betAmount > balance || isPlaying) return;
    
    setIsPlaying(true);
    setBalance(prev => prev - betAmount);
    setGameResult(null);
    setLastWinSlot(null);
    setBallPath([]);
    setBallPosition({ x: 50, y: 0 });
    
    // Simulate realistic ball physics
    simulateBallPhysics();
  }, [betAmount, balance, isPlaying]);

  const simulateBallPhysics = () => {
    const path: {x: number, y: number}[] = [];
    let currentX = 50; // Start at center
    const rows = 12;
    
    // Generate realistic path through pins
    for (let row = 0; row < rows; row++) {
      // Add some randomness but tend toward center
      const deviation = (Math.random() - 0.5) * 15;
      const centerPull = (50 - currentX) * 0.1; // Slight pull toward center
      currentX += deviation + centerPull;
      
      // Keep within bounds
      currentX = Math.max(10, Math.min(90, currentX));
      
      const y = (row + 1) * (100 / rows);
      path.push({ x: currentX, y });
    }
    
    // Animate ball along path
    animateBallAlongPath(path);
  };

  const animateBallAlongPath = (path: {x: number, y: number}[]) => {
    let currentIndex = 0;
    
    const animateStep = () => {
      if (currentIndex < path.length) {
        setBallPosition(path[currentIndex]);
        setBallPath(prev => [...prev, path[currentIndex]]);
        currentIndex++;
        
        // Variable speed - faster as it falls
        const speed = 100 + (currentIndex * 15);
        setTimeout(animateStep, speed);
      } else {
        // Ball reached bottom, determine result
        finalizeBallResult(path[path.length - 1].x);
      }
    };
    
    animateStep();
  };

  const finalizeBallResult = (finalX: number) => {
    // Map final X position to multiplier slot
    const slotIndex = Math.floor((finalX / 100) * multipliers.length);
    const clampedIndex = Math.max(0, Math.min(multipliers.length - 1, slotIndex));
    const multiplier = multipliers[clampedIndex];
    
    setLastWinSlot(clampedIndex);
    setGameResult(multiplier);
    
    // Calculate payout
    const winAmount = betAmount * multiplier;
    
    // Delay to show result
    setTimeout(() => {
      setBalance(prev => prev + winAmount);
      setIsPlaying(false);
      
      // Clear animation after delay
      setTimeout(() => {
        setBallPath([]);
        setBallPosition({ x: 50, y: 0 });
        setGameResult(null);
        setLastWinSlot(null);
      }, 2000);
    }, 500);
  };

  const renderPlinkoBoard = () => {
    const boardRows = 16;
    const pins = [];
    
    for (let row = 0; row < boardRows; row++) {
      const pinsInRow = row + 3;
      const rowPins = [];
      
      for (let pin = 0; pin < pinsInRow; pin++) {
        rowPins.push(
          <div 
            key={`${row}-${pin}`} 
            className="w-1.5 h-1.5 bg-white rounded-full opacity-80"
            style={{
              position: 'absolute',
              left: `${50 - (pinsInRow - 1) * 6 + pin * 12}%`,
              top: `${row * 16 + 10}px`
            }}
          />
        );
      }
      pins.push(...rowPins);
    }
    
    return pins;
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      {/* Enhanced Header */}
      <header className="bg-[#1a1a2e] border-b border-gray-800 p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold">PixBet</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#2a2a3e] rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">{balance.toFixed(2)}</span>
            </div>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Wallet
            </button>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm">How to play?</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Content */}
      <div className="flex-1 flex flex-col">
        {/* Game Board Container */}
        <div className="flex-1 bg-gradient-to-b from-[#212543] to-[#1a1a3e] relative p-4">
          {/* Plinko Board */}
          <div className="relative h-80 mb-4 bg-black/20 rounded-xl overflow-hidden">
            <div className="absolute inset-0">
              {renderPlinkoBoard()}
            </div>
            
            {/* Ball indicator */}
            {isPlaying && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50"></div>
              </div>
            )}
          </div>
          
          {/* Multiplier Slots */}
          <div className="flex mb-4 rounded-lg overflow-hidden">
            {multipliers.map((multiplier, index) => {
              const getColor = (mult: number) => {
                if (mult >= 100) return 'bg-gradient-to-t from-red-600 to-red-400';
                if (mult >= 25) return 'bg-gradient-to-t from-orange-600 to-orange-400';
                if (mult >= 9) return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
                if (mult >= 2) return 'bg-gradient-to-t from-green-600 to-green-400';
                return 'bg-gradient-to-t from-blue-600 to-blue-400';
              };
              
              return (
                <div 
                  key={index}
                  className={`flex-1 h-10 flex items-center justify-center text-xs font-bold text-white border-r border-white/20 last:border-r-0 ${
                    getColor(multiplier)
                  }`}
                >
                  {multiplier >= 1 ? `${multiplier}x` : `${multiplier}x`}
                </div>
              );
            })}
          </div>
          
          {/* Recent Results */}
          <div className="flex gap-2 justify-center mb-4">
            {lastResults.map((result, index) => (
              <div key={index} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                x{result}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Game Controls */}
        <div className="bg-[#1a1a2e] p-4 space-y-4 border-t border-gray-800">
          {/* Game Mode Toggle */}
          <div className="flex bg-[#2a2a3e] rounded-lg p-1">
            <button 
              onClick={() => setGameMode('manual')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                gameMode === 'manual' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Manual
            </button>
            <button 
              onClick={() => setGameMode('auto')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                gameMode === 'auto' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              Auto
            </button>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Bet amount</label>
            <div className="relative">
              <input 
                type="number" 
                value={betAmount.toFixed(9)}
                onChange={(e) => handleBetAmountChange(Number(e.target.value))}
                className="w-full bg-[#2a2a3e] border border-gray-700 rounded-lg px-3 py-4 text-white text-right pr-12"
                step="0.000000001"
                min="0.000000001"
                max={balance}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                BTC
              </div>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                0.00
              </div>
            </div>
            
            {/* Quick Bet Buttons */}
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => handleBetAmountChange(betAmount * 0.5)}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-3 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                ½
              </button>
              <button 
                onClick={() => handleBetAmountChange(betAmount * 2)}
                className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-3 px-3 rounded-lg text-sm transition-colors"
              >
                2x
              </button>
            </div>
          </div>

          {/* Volatility */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Volatility</label>
            <select 
              value={volatility}
              onChange={(e) => setVolatility(e.target.value as any)}
              className="w-full bg-[#2a2a3e] border border-gray-700 rounded-lg px-3 py-4 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Rows */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Rows</label>
            <select 
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full bg-[#2a2a3e] border border-gray-700 rounded-lg px-3 py-4 text-white"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>

          {/* Enhanced Play Button */}
          <button 
            onClick={handlePlay}
            disabled={isPlaying || betAmount > balance}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
          >
            {isPlaying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Playing...
              </>
            ) : (
              <>
                <Play size={20} />
                Bet {betAmount.toFixed(9)} BTC
              </>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <nav className="bg-[#1a1a2e] border-t border-gray-800 px-2 py-2 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-white transition-colors rounded-lg">
            <Home size={20} />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-purple-500 bg-purple-500/10 rounded-lg">
            <Gamepad2 size={20} />
            <span className="text-xs font-medium">Casino</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-white transition-colors rounded-lg">
            <TrendingUp size={20} />
            <span className="text-xs font-medium">Sports</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-white transition-colors rounded-lg">
            <User size={20} />
            <span className="text-xs font-medium">Profile</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 text-gray-400 hover:text-white transition-colors rounded-lg">
            <Wallet size={20} />
            <span className="text-xs font-medium">Wallet</span>
          </button>
        </div>
      </nav>
    </div>
  );
}