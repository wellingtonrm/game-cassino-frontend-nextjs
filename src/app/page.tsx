'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

import DashboardCards from '../components/DashboardCards';
import TopLeaders from '../components/TopLeaders';
import LiveFeed from '../components/LiveFeed';
import PromotionalBanner from '@/components/PromotionalBanner';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/wallet');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/auth');
  };

  const topPlayers = [
    { name: 'CryptoKing', avatar: '👑', winnings: 'R$ 125.450', rank: 1 },
    { name: 'LuckyStrike', avatar: '⚡', winnings: 'R$ 98.320', rank: 2 },
    { name: 'NeonGamer', avatar: '🎮', winnings: 'R$ 87.650', rank: 3 },
    { name: 'StarPlayer', avatar: '⭐', winnings: 'R$ 76.890', rank: 4 },
    { name: 'DiamondHand', avatar: '💎', winnings: 'R$ 65.430', rank: 5 }
  ];

  const liveFeed = [
    { user: 'Player123', amount: 'R$ 50', time: '2 min ago', type: 'purchase' as const },
    { user: 'WinnerX', amount: 'R$ 1.250', time: '3 min ago', type: 'win' as const },
    { user: 'LuckyOne', amount: 'R$ 25', time: '5 min ago', type: 'purchase' as const },
    { user: 'GamerPro', amount: 'R$ 750', time: '7 min ago', type: 'win' as const },
    { user: 'StarGazer', amount: 'R$ 100', time: '8 min ago', type: 'purchase' as const }
  ];

  const chatMessages = [
    { user: 'CryptoKing', message: 'Acabei de ganhar! 🎉', time: '1 min', type: 'user' as const },
    { user: 'Sistema', message: 'Novo sorteio em 15 minutos!', time: '2 min', type: 'system' as const },
    { user: 'LuckyStrike', message: 'Boa sorte pessoal! 🍀', time: '3 min', type: 'user' as const },
    { user: 'NeonGamer', message: 'Vamos que vamos! 💪', time: '5 min', type: 'user' as const }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        {/* Dashboard Cards */}
        <DashboardCards topPlayers={topPlayers} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Leaders */}
          <div className="lg:col-span-1">
            <TopLeaders players={topPlayers} />
          </div>

          {/* Live Feed */}
          <div className="lg:col-span-2">
            <LiveFeed feedItems={liveFeed} />
          </div>
        </div>
        
        {/* Promotional Banner */}
        <PromotionalBanner />
      </section>
    </div>
  );
}
