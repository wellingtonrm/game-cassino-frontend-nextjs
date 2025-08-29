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
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Sorteio Diário</h3>
            <p className="text-gray-400 text-xs">Próximo em 2h 15m</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Prêmio:</span>
            <span className="text-xl font-bold text-yellow-400">R$ 50.000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Participantes:</span>
            <span className="text-green-400 font-semibold">1.247</span>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
            Comprar Bilhete
          </button>
        </div>
      </div>

      {/* Card Vencedores da Semana */}
      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Vencedores da Semana</h3>
            <p className="text-gray-400 text-xs">Top 3 ganhadores</p>
          </div>
        </div>
        <div className="space-y-2">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{player.avatar}</span>
                <span className="font-medium text-sm">{player.name}</span>
              </div>
              <span className="text-green-400 font-bold text-sm">{player.winnings}</span>
            </div>
          ))}
        </div>
        <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-2 rounded-lg mt-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
          Ver Ranking Completo
        </button>
      </div>

      {/* Card Como Funciona */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Como Funciona?</h3>
            <p className="text-gray-400 text-xs">Guia rápido</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-sm">Compre seus bilhetes</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-sm">Aguarde o sorteio</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <span className="text-sm">Ganhe prêmios!</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 rounded-lg mt-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50">
          Saiba Mais
        </button>
      </div>
    </div>
  );
}