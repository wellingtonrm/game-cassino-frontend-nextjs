'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { 
  MessageCircle, 
  Gift, 
  Trophy, 
  User,
  Minus,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Hook para detectar tamanho da tela
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 1024,
    height: 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}

interface GameNumber {
  number: number;
  isSelected: boolean;
  color: 'blue' | 'orange';
}

export default function GamePage() {
  const windowSize = useWindowSize();
  const { user, requireAuth } = useAuth();
  const { balance, formatCurrency } = useWallet();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameNumbers, setGameNumbers] = useState<GameNumber[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [friendsJoined, setFriendsJoined] = useState(2);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameTimer, setGameTimer] = useState(0);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    requireAuth();
  }, []);

  useEffect(() => {
    // Initialize game numbers in circular pattern
    const numbers: GameNumber[] = [];
    const circularNumbers = [6, 1, 8, 11, 10, 9, 7, 13, 14];
    
    circularNumbers.forEach((num, index) => {
      numbers.push({
        number: num,
        isSelected: false,
        color: index % 2 === 0 ? 'orange' : 'blue'
      });
    });
    
    setGameNumbers(numbers);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pulse = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);
    return () => clearInterval(pulse);
  }, []);

  const handleNumberSelect = (number: number) => {
    if (isPlaying) return;
    
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const handleBetAmountChange = (change: number) => {
    setBetAmount(prev => Math.max(1, prev + change));
  };

  const handleMaxBet = () => {
    setBetAmount(balance);
  };

  const handleClearBet = () => {
    setBetAmount(100);
    setSelectedNumbers([]);
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    if (selectedNumbers.length === 0 || betAmount > balance) return;
    
    setIsPlaying(true);
    setCountdown(10);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1b3a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b3a] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#1a1b3a] border-b border-[#2a2b4a]">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-[#ff6b35] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          
          {/* Daily Quests */}
          <div className="hidden md:flex items-center space-x-2 bg-[#2a2b4a] rounded-lg px-3 py-2">
            <Trophy className="w-4 h-4 text-[#4fc3f7]" />
            <span className="text-sm text-gray-300">Daily Quests</span>
            <span className="bg-[#ff6b35] text-white text-xs px-2 py-1 rounded-full">2</span>
          </div>
          
          {/* Bonus Rewards */}
          <div className="hidden md:flex items-center space-x-2 bg-[#2a2b4a] rounded-lg px-3 py-2">
            <Gift className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-gray-300">Bonus Rewards</span>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* XP */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#ff6b35] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">XP</span>
            </div>
            <span className="text-[#ff6b35] font-bold">250</span>
          </div>
          
          {/* Balance */}
          <div className="flex items-center space-x-2 bg-[#2a2b4a] rounded-lg px-3 py-2">
            <div className="w-6 h-6 bg-[#4fc3f7] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">$</span>
            </div>
            <span className="text-white font-bold">{formatCurrency(balance)}</span>
          </div>
          
          {/* User */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4fc3f7] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium hidden sm:block">{user.name}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Main Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
          {/* Circular Game Board */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mb-4 sm:mb-8">
            {/* Outer Circle */}
            <div className={`absolute inset-0 rounded-full border-4 border-[#2a2b4a] bg-gradient-to-br from-[#2a2b4a] to-[#1a1b3a] transition-all duration-500 ${isSpinning ? 'animate-pulse' : ''}`}>
              {/* Game Numbers */}
              {gameNumbers.map((gameNum, index) => {
                const angle = (index * 40) - 90; // 40 degrees apart, starting from top
                const radius = windowSize.width < 640 ? 100 : windowSize.width < 1024 ? 120 : 140;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <button
                    key={gameNum.number}
                    onClick={() => handleNumberSelect(gameNum.number)}
                    className={`absolute w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base lg:text-lg transition-all transform hover:scale-110 ${
                      selectedNumbers.includes(gameNum.number)
                        ? 'bg-[#ff6b35] text-white shadow-lg shadow-[#ff6b35]/50'
                        : gameNum.color === 'orange'
                        ? 'bg-[#ff6b35] text-white'
                        : 'bg-[#4fc3f7] text-white'
                    } ${isSpinning ? 'animate-bounce' : ''} ${pulseAnimation ? 'animate-pulse' : ''}`}
                    style={{
                      left: `calc(50% + ${x}px - ${windowSize.width < 640 ? '20px' : windowSize.width < 1024 ? '24px' : '32px'})`,
                      top: `calc(50% + ${y}px - ${windowSize.width < 640 ? '20px' : windowSize.width < 1024 ? '24px' : '32px'})`,
                      animationDelay: `${index * 0.1}s`
                    }}
                    disabled={isPlaying}
                  >
                    {gameNum.number}
                  </button>
                );
              })}
              
              {/* Center Circle with Countdown */}
              <div className={`absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] flex items-center justify-center transition-all duration-300 ${isSpinning ? 'animate-spin' : ''} ${pulseAnimation ? 'scale-110' : ''}`}>
                {isPlaying ? (
                  <div className="text-center">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{countdown}</div>
                    <div className="text-xs text-white opacity-80">seg</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm sm:text-base lg:text-lg font-bold text-white">{formatTime(gameTimer)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Selected Numbers Display */}
          <div className="flex items-center space-x-2 mb-6">
            {[11, 8, 11, 13, 7, 14].map((num, index) => (
              <div key={index} className="w-10 h-10 bg-[#4fc3f7] rounded-lg flex items-center justify-center text-white font-bold">
                {num}
              </div>
            ))}
          </div>
          
          {/* Friends Joined */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-[#4fc3f7] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-300">Friends joined:</span>
            <span className="text-white font-bold">{friendsJoined}/2</span>
            <button className="bg-[#ff6b35] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#ff8c42] transition-colors">
              Invite a friend
            </button>
          </div>
          
          {/* Bottom Numbers Grid */}
          <div className="grid grid-cols-9 gap-1 sm:gap-2 mb-4 sm:mb-6">
            {/* First row: 1 to 9 */}
            {Array.from({length: 9}, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => handleNumberSelect(num)}
                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg font-bold text-xs sm:text-sm lg:text-base transition-all transform hover:scale-105 hover:rotate-3 active:scale-95 ${
                  selectedNumbers.includes(num)
                    ? 'bg-[#ff6b35] text-white'
                    : 'bg-[#2a2b4a] text-gray-300 hover:bg-[#3a3b5a]'
                }`}
                disabled={isPlaying}
              >
                {num}
              </button>
            ))}
            
            {/* Second row: 10 to 17 */}
            {Array.from({length: 8}, (_, i) => i + 10).map(num => (
              <button
                key={num}
                onClick={() => handleNumberSelect(num)}
                className={`w-12 h-12 rounded-lg font-bold transition-all transform hover:scale-105 hover:rotate-3 active:scale-95 ${
                  selectedNumbers.includes(num)
                    ? 'bg-[#ff6b35] text-white'
                    : 'bg-[#2a2b4a] text-gray-300 hover:bg-[#3a3b5a]'
                }`}
                disabled={isPlaying}
              >
                {num}
              </button>
            ))}
          </div>
          
          {/* Bet Controls */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-[#2a2b4a] rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.02]">
            {/* Balance Display */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#4fc3f7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">$</span>
              </div>
              <span className="text-white font-bold">{formatCurrency(balance)}</span>
            </div>
            
            {/* Bet Amount Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBetAmountChange(-10)}
                className="w-8 h-8 bg-[#3a3b5a] rounded-lg flex items-center justify-center text-white hover:bg-[#4a4b6a] transition-colors"
                disabled={isPlaying}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="bg-[#1a1b3a] px-4 py-2 rounded-lg">
                <span className="text-white font-bold">{formatCurrency(betAmount)}</span>
              </div>
              <button
                onClick={() => handleBetAmountChange(10)}
                className="w-8 h-8 bg-[#3a3b5a] rounded-lg flex items-center justify-center text-white hover:bg-[#4a4b6a] transition-colors"
                disabled={isPlaying}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Multiplier Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-gray-300 text-xs sm:text-sm">1/2</span>
              <span className="text-gray-300 text-xs sm:text-sm">1x</span>
              <button className={`bg-[#ff6b35] text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold transition-all duration-300 ${pulseAnimation ? 'scale-110' : ''}`}>
                2x
              </button>
              <span className="text-gray-300 text-xs sm:text-sm">3x</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                onClick={handleSpin}
                disabled={isSpinning || isPlaying}
                className={`bg-gradient-to-r from-[#ff6b35] to-[#ff8c42] hover:from-[#ff8c42] hover:to-[#ffad42] text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isSpinning ? 'animate-pulse' : ''}`}
              >
                {isSpinning ? 'GIRANDO...' : 'APOSTAR'}
              </button>
              
              <button
                onClick={handleMaxBet}
                className="bg-[#ff6b35] text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-[#ff8c42] transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={isPlaying}
              >
                Max
              </button>
              
              <button
                onClick={handleClearBet}
                className="bg-[#3a3b5a] text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-[#4a4b6a] transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={isPlaying}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Live Chat */}
        <div className="w-full lg:w-80 bg-[#1a1b3a] border-t lg:border-t-0 lg:border-l border-[#2a2b4a] flex flex-col max-h-96 lg:max-h-none">
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-[#2a2b4a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#4fc3f7]" />
                <span className="font-bold text-white text-sm sm:text-base">LIVE CHAT</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs sm:text-sm transition-all duration-300 hover:text-[#ff6b35]">193 online</span>
              </div>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
            {/* Sample Messages */}
            <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4fc3f7] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#ff6b35]">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-xs sm:text-sm hover:text-[#ff6b35] transition-colors cursor-pointer">jack_gameon</span>
                  <span className="text-gray-400 text-xs">1 min ago</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">wow, again I have won the game, another one, let's goooo 😊</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ff6b35] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#4fc3f7]">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-xs sm:text-sm hover:text-[#ff6b35] transition-colors cursor-pointer">andrew330</span>
                  <span className="text-gray-400 text-xs">2 min ago</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">gm everyone! 🔥 today is a good day to win some cheddar 🧀</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4fc3f7] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#ff6b35]">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-xs sm:text-sm hover:text-[#ff6b35] transition-colors cursor-pointer">spaceG</span>
                  <span className="text-gray-400 text-xs">3 min ago</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">has just completed</p>
              </div>
            </div>
            
            {/* Daily Quest Notification */}
            <div className={`bg-[#ff6b35] rounded-lg p-2 sm:p-3 transform transition-all duration-300 hover:scale-[1.02] ${pulseAnimation ? 'animate-pulse' : ''}`}>
              <div className="flex items-center space-x-2">
                <Trophy className={`w-3 h-3 sm:w-4 sm:h-4 text-white transition-all duration-300 ${pulseAnimation ? 'animate-bounce' : ''}`} />
                <span className="text-white font-bold text-xs sm:text-sm">Daily Quest</span>
              </div>
              <p className="text-white text-xs sm:text-sm mt-1">Say congratulations!</p>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#4fc3f7] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#ff6b35]">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-xs sm:text-sm hover:text-[#ff6b35] transition-colors cursor-pointer">adelle002</span>
                  <span className="text-gray-400 text-xs">4 min ago</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">hey @samantha that's for sure, I'm feelin it too, let's gooo</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2 sm:space-x-3 animate-fade-in">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ff6b35] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#4fc3f7]">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-xs sm:text-sm hover:text-[#ff6b35] transition-colors cursor-pointer">jackie</span>
                  <span className="text-gray-400 text-xs">5 min ago</span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm">what a fantastic platform, can't stop won't stop</p>
              </div>
            </div>
          </div>
          
          {/* Chat Input */}
          <div className="p-3 sm:p-4 border-t border-[#2a2b4a]">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 bg-[#2a2b4a] text-white placeholder-gray-400 px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4fc3f7] transition-all duration-300 focus:scale-[1.02] text-xs sm:text-sm"
              />
              <button className="bg-[#4fc3f7] text-white p-2 rounded-lg hover:bg-[#3fb3e7] transition-all duration-200 transform hover:scale-110 active:scale-95">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}