'use client';

import { Award, Trophy } from 'lucide-react';

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
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-casino-gradient rounded-xl flex items-center justify-center casino-glow-gold">
          <Trophy className="w-5 h-5 text-casino-dark" />
        </div>
        <h2 className="text-2xl font-bold text-casino-light">Melhores Jogadores</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {players.map((player, index) => (
          <div key={index} className="casino-glass rounded-2xl p-4 casino-glow-secondary hover:scale-105 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-casino-quaternary/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-casino-gold/20 transition-all">
                <span className="text-2xl">{player.avatar}</span>
              </div>
              <h3 className="font-bold text-casino-light mb-1">{player.name}</h3>
              <p className="text-casino-gold font-bold text-lg mb-2">{player.winnings}</p>
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-4 h-4 text-casino-gold" />
                <span className="text-sm text-casino-light/60 font-medium">#{player.rank}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}