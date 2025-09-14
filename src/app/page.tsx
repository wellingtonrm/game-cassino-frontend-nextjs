'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameAnalytics } from '@/hooks/useGameAnalytics';
import { 
  Play, 
  Menu,
  User,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function PlinkoGamePage() {
  
  const router = useRouter();
  const { trackGameResult, endGameSession } = useGameAnalytics();
  const [balance, setBalance] = useState(21.38);
  const [betAmount, setBetAmount] = useState(23.71);
  const [gameMode, setGameMode] = useState<'bet' | 'autobet'>('bet');
  const [riskLevel, setRiskLevel] = useState('custom');
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [ballPath, setBallPath] = useState<{x: number, y: number}[]>([]);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [lastWinSlot, setLastWinSlot] = useState<number | null>(null);

  // Exactly 9 multiplier slots as shown in image
  const multipliers = [8.9, 3, 1.4, 1.2, 1.1, 1.2, 1.4, 3, 8.9];
  const lastResults = [8.9, 1.1, 1.2, 1.4];

  const handleBetChange = (amount: number) => {
    setBetAmount(Math.max(0.01, Math.min(balance, amount)));
  };

  const startGame = () => {
    if (betAmount <= balance && !isPlaying) {
      setIsPlaying(true);
      setGameResult(null);
      setLastWinSlot(null);
      setBallPath([]);
      setBallPosition({ x: 50, y: 0 });
      
      // Simulate realistic ball physics
      simulateBallPhysics();
    }
  };

  const simulateBallPhysics = () => {
    const path: {x: number, y: number}[] = [];
    let currentX = 50; // Start at center
    const rows = 14;
    
    // Generate realistic path through pins
    for (let row = 0; row < rows; row++) {
      const deviation = (Math.random() - 0.5) * 12;
      const centerPull = (50 - currentX) * 0.08;
      currentX += deviation + centerPull;
      
      currentX = Math.max(15, Math.min(85, currentX));
      
      const y = (row + 1) * (100 / rows);
      path.push({ x: currentX, y });
    }
    
    animateBallAlongPath(path);
  };

  const animateBallAlongPath = (path: {x: number, y: number}[]) => {
    let currentIndex = 0;
    
    const animateStep = () => {
      if (currentIndex < path.length) {
        setBallPosition(path[currentIndex]);
        setBallPath(prev => [...prev, path[currentIndex]]);
        currentIndex++;
        
        const speed = 80 + (currentIndex * 10);
        setTimeout(animateStep, speed);
      } else {
        finalizeBallResult(path[path.length - 1].x);
      }
    };
    
    animateStep();
  };

  const finalizeBallResult = (finalX: number) => {
    const slotIndex = Math.floor((finalX / 100) * multipliers.length);
    const clampedIndex = Math.max(0, Math.min(multipliers.length - 1, slotIndex));
    const multiplier = multipliers[clampedIndex];
    
    setLastWinSlot(clampedIndex);
    setGameResult(multiplier);
    
    const payout = betAmount * multiplier;
    const isWin = payout > betAmount;
    
   
    
    setTimeout(() => {
      setBalance(prev => prev - betAmount + payout);
      setIsPlaying(false);
      
      setTimeout(() => {
        setBallPath([]);
        setBallPosition({ x: 50, y: 0 });
        setGameResult(null);
        setLastWinSlot(null);
      }, 2000);
    }, 500);
  };

  const renderPlinkoBoard = () => {
    const pins = [];
    const rows = 14;
    
    for (let row = 0; row < rows; row++) {
      const pinsInRow = Math.min(3 + row, 15);
      
      for (let pin = 0; pin < pinsInRow; pin++) {
        const pinX = 50 - (pinsInRow - 1) * 3 + pin * 6;
        const pinY = 10 + row * 18;
        
        pins.push(
          <div 
            key={`${row}-${pin}`} 
            className="w-1.5 h-1.5 bg-white rounded-full opacity-80"
            style={{
              position: 'absolute',
              left: `${pinX}%`,
              top: `${pinY}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      }
    }
    
    return pins;
  };

  return (
    <div className="min-h-screen text-white">
      {/* Game Board */}
      <div className="p-4">
        <div className="relative h-96 bg-gradient-to-b from-[#2a2a4e] to-[#1a1a3e] rounded-xl overflow-hidden border border-gray-700">
          {/* Pins */}
          <div className="absolute inset-0">
            {renderPlinkoBoard()}
          </div>
          
          {/* Ball Path */}
          {ballPath.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M ${ballPath.map((point, index) => 
                  `${index === 0 ? 'M' : 'L'} ${point.x}% ${(point.y / 100) * 90}%`
                ).join(' ')}`}
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          )}
          
          {/* Animated Ball */}
          {(isPlaying || ballPath.length > 0) && (
            <div 
              className="absolute w-3 h-3 bg-red-500 rounded-full shadow-lg transition-all duration-100 ease-out z-10"
              style={{
                left: `${ballPosition.x}%`,
                top: `${(ballPosition.y / 100) * 90}%`,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
              }}
            />
          )}
          
          {/* Multiplier Slots - Exactly 9 */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {multipliers.map((multiplier, index) => {
              const getSlotColor = (mult: number, idx: number) => {
                if (idx === 0 || idx === 8) return 'bg-gradient-to-t from-red-600 to-red-400'; // 8.9x
                if (mult === 3) return 'bg-gradient-to-t from-orange-600 to-orange-400'; // 3x
                if (mult === 1.4) return 'bg-gradient-to-t from-yellow-600 to-yellow-400'; // 1.4x
                return 'bg-gradient-to-t from-green-600 to-green-400'; // 1.2x, 1.1x
              };
              
              const isWinning = lastWinSlot === index;
              
              return (
                <div 
                  key={index}
                  className={`flex-1 h-8 flex items-center justify-center text-xs font-bold text-white transition-all duration-300 ${
                    getSlotColor(multiplier, index)
                  } ${
                    isWinning ? 'scale-110 animate-pulse ring-2 ring-white' : ''
                  }`}
                >
                  {multiplier}x
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recent Results */}
        <div className="flex gap-2 justify-center mt-4">
          {lastResults.map((result, index) => (
            <div key={index} className="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {result}x
            </div>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="p-4 space-y-4">
        {/* Bet/Autobet Toggle */}
        <div className="flex bg-[#2a2a3e] rounded-lg p-1">
          <button 
            onClick={() => setGameMode('bet')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              gameMode === 'bet' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Bet
          </button>
          <button 
            onClick={() => setGameMode('autobet')}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              gameMode === 'autobet' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Autobet
          </button>
        </div>

        {/* Bet Amount */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Bet amount</label>
          <div className="relative">
            <input 
              type="number" 
              value={betAmount.toFixed(2)}
              onChange={(e) => handleBetChange(Number(e.target.value))}
              className="w-full bg-[#2a2a3e] border border-gray-600 rounded-lg px-4 py-4 text-white text-xl font-bold"
              step="0.01"
              min="0.01"
              max={balance}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
            </div>
          </div>
          
          {/* Quick Bet Buttons */}
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => handleBetChange(betAmount * 0.5)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 px-3 rounded-lg text-sm font-bold text-white transition-colors"
            >
              1/2
            </button>
            <button 
              onClick={() => handleBetChange(betAmount * 2)}
              className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-3 px-3 rounded-lg text-sm font-bold text-white transition-colors"
            >
              2x
            </button>
            <button 
              onClick={() => handleBetChange(balance)}
              className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-3 px-3 rounded-lg text-sm font-bold text-white transition-colors"
            >
              max
            </button>
          </div>
        </div>

        {/* Risk */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Risk</label>
          <select 
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full bg-[#2a2a3e] border border-gray-600 rounded-lg px-4 py-4 text-white text-lg"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Play Button */}
        <button 
          onClick={startGame}
          disabled={isPlaying || betAmount > balance}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-4 rounded-lg font-bold text-lg text-white transition-colors flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Dropping Ball...
            </>
          ) : (
            <>
              <Play size={20} />
              Bet ${betAmount.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}