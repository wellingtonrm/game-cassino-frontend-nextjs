  'use client';

import { Trophy, Crown, Target } from 'lucide-react';

interface Player {
  name: string;
  avatar: string;
  winnings: string;
  rank: number;
}

interface DashboardCardsProps {
  topPlayers: Player[];
}

export default function DashboardCards({ topPlayers }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card Sorteio Diário */}
      <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Sorteio Diário</h3>
            <p className="text-gray-400 text-sm">Próximo em 2h 15m</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Prêmio:</span>
            <span className="text-xl font-semibold text-yellow-400">R$ 50.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Participantes:</span>
            <span className="text-green-400 font-medium">1.247</span>
          </div>
          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200">
            Comprar Bilhete
          </button>
        </div>
      </div>

      {/* Card Vencedores da Semana */}
      <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Vencedores da Semana</h3>
            <p className="text-gray-400 text-sm">Top 3 ganhadores</p>
          </div>
        </div>
        <div className="space-y-2">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{player.avatar}</span>
                <span className="font-medium text-sm text-white">{player.name}</span>
              </div>
              <span className="text-green-400 font-medium text-sm">{player.winnings}</span>
            </div>
          ))}
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg mt-3 transition-all duration-200">
          Ver Ranking Completo
        </button>
      </div>

      {/* Card Como Funciona */}
      <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Como Funciona?</h3>
            <p className="text-gray-400 text-sm">Guia rápido</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-medium text-white">1</div>
            <span className="text-sm text-gray-300">Compre seus bilhetes</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-medium text-white">2</div>
            <span className="text-sm text-gray-300">Aguarde o sorteio</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-medium text-white">3</div>
            <span className="text-sm text-gray-300">Ganhe prêmios!</span>
          </div>
        </div>
        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg mt-4 transition-all duration-200">
          Saiba Mais
        </button>
      </div>
    </div>
  );
}