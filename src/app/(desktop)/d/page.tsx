'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Users, 
  Trophy,
  Zap,
  Target,
  DollarSign,
  BarChart3,
  Clock,
  Star,
  Menu,
  Bell,
  Search,
  Home,
  Dice1,
  Gamepad2,
  User,
  Wallet,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';

export default function PlinkoGame() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState(0.546698956);
  const [betAmount, setBetAmount] = useState(10);
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [riskLevel, setRiskLevel] = useState<'low' | 'average' | 'high'>('average');
  const [lines, setLines] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'highest' | 'latest' | 'rollers'>('highest');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/wallet');
    }
  }, [isAuthenticated, router]);

  const highestWins = [
    { user: 'Mine', avatar: '👑', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '⚡', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🎮', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ];

  const latestBets = [
    { user: 'Mine', avatar: '🎯', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🍀', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ];

  const highRollers = [
    { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🐋', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '💰', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'highest': return highestWins;
      case 'latest': return latestBets;
      case 'rollers': return highRollers;
      default: return highestWins;
    }
  };

  const handleBetChange = (amount: number) => {
    setBetAmount(Math.max(1, Math.min(balance, amount)));
  };

  const handleQuickBet = (multiplier: number) => {
    const newAmount = betAmount * multiplier;
    setBetAmount(Math.min(balance, newAmount));
  };

  const handleMaxBet = () => {
    setBetAmount(balance);
  };

  const startGame = () => {
    if (betAmount <= balance) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
        const multipliers = [0.2, 0.5, 1, 2, 5, 10, 25, 50, 120];
        const randomMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        const payout = betAmount * randomMultiplier;
        setBalance(prev => prev - betAmount + payout);
      }, 3000);
    }
  };

  const renderPlinkoBoard = () => {
    const rows = 16;
    const pins = [];
    
    for (let row = 0; row < rows; row++) {
      const pinsInRow = row + 1;
      const rowPins = [];
      
      for (let pin = 0; pin < pinsInRow; pin++) {
        rowPins.push(
          <div 
            key={`${row}-${pin}`} 
            className="w-2 h-2 bg-white rounded-full"
            style={{
              position: 'absolute',
              left: `${50 - (pinsInRow - 1) * 12 + pin * 24}%`,
              top: `${row * 24 + 20}px`
            }}
          />
        );
      }
      pins.push(...rowPins);
    }
    
    return pins;
  };

  const multipliers = [120, 25, 8, 3, 1.5, 1, 0.7, 0.4, 0.4, 0.7, 1, 1.5, 3, 8, 25, 120];

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-[#1a1a2e] transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="text-2xl font-bold">ONLINE CASINO</div>
          </div>
          
          <nav className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/20 text-purple-400">
              <Gamepad2 size={20} />
              <span>Casino</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <Trophy size={20} />
              <span>Sports</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <TrendingUp size={20} />
              <span>Trading</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <Zap size={20} />
              <span>Racing</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <Target size={20} />
              <span>Lottery</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <Star size={20} />
              <span>VIP Club</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
              <BarChart3 size={20} />
              <span>Leaderboard</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#1a1a2e] border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu size={20} />
              </button>
              <div className="text-xl font-bold">CASINO</div>
              <div className="text-gray-400">Plinko</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search game..."
                  className="bg-[#2a2a3e] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 bg-[#2a2a3e] rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">{balance.toFixed(8)}</span>
                <ChevronDown size={16} />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                Deposit
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                  EN
                </div>
                <Bell size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Left Panel - Game Controls */}
          <div className="w-80 bg-[#1a1a2e] p-6 space-y-6">
            {/* Game Mode */}
            <div>
              <div className="flex bg-[#2a2a3e] rounded-lg p-1 mb-4">
                <button 
                  onClick={() => setGameMode('manual')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    gameMode === 'manual' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  MANUAL
                </button>
                <button 
                  onClick={() => setGameMode('auto')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    gameMode === 'auto' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  AUTO
                </button>
              </div>
            </div>

            {/* Balance */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Balance</label>
              <div className="text-lg font-mono">{balance.toFixed(8)}</div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Your Bet</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={betAmount}
                  onChange={(e) => handleBetChange(Number(e.target.value))}
                  className="w-full bg-[#2a2a3e] border border-gray-700 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max={balance}
                />
                <div className="flex gap-1 mt-2">
                  <button 
                    onClick={() => handleQuickBet(0.5)}
                    className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-1 px-2 rounded text-xs transition-colors"
                  >
                    ½
                  </button>
                  <button 
                    onClick={() => handleQuickBet(2)}
                    className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-1 px-2 rounded text-xs transition-colors"
                  >
                    2x
                  </button>
                  <button 
                    onClick={() => handleQuickBet(10)}
                    className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-1 px-2 rounded text-xs transition-colors"
                  >
                    +10
                  </button>
                  <button 
                    onClick={() => handleMaxBet()}
                    className="flex-1 bg-[#2a2a3e] hover:bg-gray-700 py-1 px-2 rounded text-xs transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            {/* Number of Lines */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Number of Lines</label>
              <select 
                value={lines}
                onChange={(e) => setLines(Number(e.target.value))}
                className="w-full bg-[#2a2a3e] border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Choose a risk</label>
              <div className="flex bg-[#2a2a3e] rounded-lg p-1">
                <button 
                  onClick={() => setRiskLevel('low')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    riskLevel === 'low' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Low
                </button>
                <button 
                  onClick={() => setRiskLevel('average')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    riskLevel === 'average' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Average
                </button>
                <button 
                  onClick={() => setRiskLevel('high')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    riskLevel === 'high' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* Start Game Button */}
            <button 
              onClick={startGame}
              disabled={isPlaying}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 py-4 rounded-lg font-bold text-lg transition-colors"
            >
              {isPlaying ? 'Playing...' : 'Start The Game'}
            </button>
          </div>

          {/* Center Panel - Game Board */}
          <div className="flex-1 bg-[#212543] relative flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400">Drop here</div>
            </div>
            
            {/* Plinko Board */}
            <div className="relative w-full max-w-2xl h-96 border-2 border-gray-700 rounded-lg bg-gradient-to-b from-[#2a2a4e] to-[#1a1a3e]">
              {renderPlinkoBoard()}
              
              {/* Multiplier Slots */}
              <div className="absolute bottom-0 left-0 right-0 flex">
                {multipliers.map((multiplier, index) => {
                  const getColor = (mult: number) => {
                    if (mult >= 25) return 'bg-gradient-to-t from-purple-600 to-purple-400';
                    if (mult >= 8) return 'bg-gradient-to-t from-pink-600 to-pink-400';
                    if (mult >= 3) return 'bg-gradient-to-t from-red-600 to-red-400';
                    if (mult >= 1) return 'bg-gradient-to-t from-orange-600 to-orange-400';
                    return 'bg-gradient-to-t from-blue-600 to-blue-400';
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`flex-1 h-12 flex items-center justify-center text-xs font-bold text-white border-r border-gray-700 last:border-r-0 ${
                        getColor(multiplier)
                      }`}
                    >
                      {multiplier}x
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Stats */}
          <div className="w-80 bg-[#1a1a2e] p-6">
            {/* Tabs */}
            <div className="flex mb-4">
              <button 
                onClick={() => setActiveTab('highest')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'highest' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Highest win
              </button>
              <button 
                onClick={() => setActiveTab('latest')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'latest' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                Latest bets
              </button>
              <button 
                onClick={() => setActiveTab('rollers')}
                className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${
                  activeTab === 'rollers' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                High Rollers
              </button>
            </div>

            {/* Stats List */}
            <div className="space-y-3">
              {getCurrentData().map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-[#2a2a3e] rounded-lg">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{item.user}</div>
                    <div className="text-xs text-gray-400">Mode Warren</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-500">{item.bet}</div>
                    <div className="text-xs text-gray-400">{item.multiplier}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-500">{item.payout}</div>
                    <div className="text-xs text-gray-400">Payout</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
