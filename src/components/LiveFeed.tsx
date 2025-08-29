'use client';

import { Trophy, Ticket } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="text-lg font-bold">Feed ao Vivo</h2>
        <span className="text-xs text-gray-400">Atividade em tempo real</span>
      </div>
      <div className="space-y-2">
        {feedItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.type === 'win' ? 'bg-green-500' : 'bg-blue-500'
              }`}>
                {item.type === 'win' ? <Trophy className="w-3 h-3" /> : <Ticket className="w-3 h-3" />}
              </div>
              <div>
                <p className="font-medium text-sm">{item.user}</p>
                <p className="text-xs text-gray-400">
                  {item.type === 'win' ? 'Ganhou' : 'Comprou bilhete'} • {item.time}
                </p>
              </div>
            </div>
            <span className={`font-bold text-sm ${
              item.type === 'win' ? 'text-green-400' : 'text-blue-400'
            }`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}