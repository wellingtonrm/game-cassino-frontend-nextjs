'use client';

import { Award } from 'lucide-react';

interface Player {
  name: string;
  avatar: string;
  winnings: string;
  rank: number;
}

interface TopLeadersProps {
  players: Player[];
}

export default function TopLeaders({ players }: TopLeadersProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">🏆 Melhores Jogadores</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {players.map((player, index) => (
          <div key={index} className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="text-2xl mb-2">{player.avatar}</div>
              <h3 className="font-bold text-sm">{player.name}</h3>
              <p className="text-yellow-400 font-bold text-sm">{player.winnings}</p>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-gray-400">#{player.rank}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}