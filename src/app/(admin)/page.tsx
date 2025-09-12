'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PlayerStatistics } from '@/components/PlayerStatistics';
import { RiskAnalysis } from '@/components/RiskAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { isAuthenticated, address, logout } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('statistics');

  useEffect(() => {
    // Redirect to auth page if not authenticated
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Player Dashboard</h1>
            <p className="text-gray-400">Track your gaming statistics and performance</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Connected Address</p>
                <p className="text-white font-mono text-sm">{address || '0x1234...5678'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Authentication Status</p>
                <p className="text-green-400 font-medium">Authenticated</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Account Balance</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">USDT Balance</span>
                <span className="text-white font-medium">0.00 USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MATIC Balance</span>
                <span className="text-white font-medium">0.00 MATIC</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Value</span>
                  <span className="text-white font-bold text-lg">0.00 USD</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full" variant="default">
                Deposit Funds
              </Button>
              <Button className="w-full" variant="outline">
                Withdraw Funds
              </Button>
              <Button className="w-full" variant="secondary">
                Game History
              </Button>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
            <TabsTrigger value="statistics" className="data-[state=active]:bg-purple-600">Statistics</TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-purple-600">Risk Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="statistics">
            <PlayerStatistics />
          </TabsContent>
          <TabsContent value="risk">
            <RiskAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}