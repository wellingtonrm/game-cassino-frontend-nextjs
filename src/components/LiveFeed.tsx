'use client';

import { Trophy, Ticket, Activity } from 'lucide-react';

interface FeedItem {
  user: string;
  type: 'win' | 'purchase';
  amount: string;
  time: string;
}

interface LiveFeedProps {
  feedItems: FeedItem[];
}

export default function LiveFeed({ feedItems }: LiveFeedProps) {
  return (
    <div className="casino-glass rounded-2xl p-6 casino-glow-secondary">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 bg-casino-cyan rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-casino-dark" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-casino-light">Feed ao Vivo</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-casino-cyan rounded-full animate-pulse"></div>
            <span className="text-sm text-casino-light/60">Atividade em tempo real</span>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {feedItems.map((item, index) => (
          <div key={index} className="casino-glass rounded-lg p-3 hover:bg-casino-quaternary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  item.type === 'win' ? 'bg-casino-gold' : 'bg-casino-cyan'
                }`}>
                  {item.type === 'win' ? <Trophy className="w-4 h-4 text-casino-dark" /> : <Ticket className="w-4 h-4 text-casino-dark" />}
                </div>
                <div>
                  <p className="font-bold text-casino-light">{item.user}</p>
                  <p className="text-sm text-casino-light/60">
                    {item.type === 'win' ? 'Ganhou' : 'Comprou bilhete'} • {item.time}
                  </p>
                </div>
              </div>
              <span className={`font-bold text-lg ${
                item.type === 'win' ? 'text-casino-gold' : 'text-casino-cyan'
              }`}>
                {item.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}