import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock data for statistics tabs (this would come from your backend/store)
const mockStats = {
  highest: [
    { user: 'Mine', avatar: '👑', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '⚡', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🎮', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ],
  latest: [
    { user: 'Mine', avatar: '🎯', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🍀', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ],
  rollers: [
    { user: 'Mine', avatar: '💎', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '🐋', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
    { user: 'Mine', avatar: '💰', bet: '0.546698956', multiplier: '120x', payout: '0.546698956' },
  ]
};

type StatsTab = 'highest' | 'latest' | 'rollers';

/**
 * GameStats Component
 * 
 * Displays community game statistics with tabbed interface.
 * Follows Material You design principles for consistency.
 */
export const GameStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatsTab>('highest');

  const getCurrentData = () => {
    return mockStats[activeTab];
  };

  return (
    <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg mx-3 p-3">
      <h3 className="text-sm font-bold text-purple-400 mb-3">Game Statistics</h3>
      
      {/* Tabs */}
      <div className="flex mb-3 bg-[#2a2a3e] rounded-lg p-1">
        <button 
          onClick={() => setActiveTab('highest')}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
            activeTab === 'highest' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          )}
        >
          Highest
        </button>
        <button 
          onClick={() => setActiveTab('latest')}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
            activeTab === 'latest' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          )}
        >
          Latest
        </button>
        <button 
          onClick={() => setActiveTab('rollers')}
          className={cn(
            "flex-1 py-1.5 px-2 text-xs font-medium transition-colors rounded",
            activeTab === 'rollers' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
          )}
        >
          Rollers
        </button>
      </div>
      
      {/* Stats List */}
      <div className="space-y-2">
        {getCurrentData().slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-[#2a2a3e] rounded-lg">
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
              {item.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{item.user}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-yellow-500 font-mono">{item.bet}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-500 font-mono">{item.payout}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};