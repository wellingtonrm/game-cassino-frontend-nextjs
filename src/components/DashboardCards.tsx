'use client';

import { Trophy, Crown, Target, Gift, Users, BookOpen } from 'lucide-react';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Card Sorteio Diário */}
      <div className="casino-glass rounded-2xl p-6 casino-glow-primary hover:scale-105 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-casino-gradient rounded-xl flex items-center justify-center casino-glow-gold">
            <Gift className="w-6 h-6 text-casino-dark" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-casino-light">Sorteio Diário</h3>
            <p className="text-casino-light/60 text-sm">Próximo em 2h 15m</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="casino-glass rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-casino-light/80 text-sm">Prêmio:</span>
              <span className="text-2xl font-bold text-casino-gold">R$ 50.000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-casino-light/80 text-sm">Participantes:</span>
              <span className="text-casino-cyan font-bold">1.247</span>
            </div>
          </div>
          <button className="w-full bg-casino-gradient hover:scale-105 text-casino-dark font-bold py-3 rounded-xl transition-all duration-200 casino-glow-gold">
            COMPRAR BILHETE
          </button>
        </div>
      </div>

      {/* Card Vencedores da Semana */}
      <div className="casino-glass rounded-2xl p-6 casino-glow-secondary hover:scale-105 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-casino-gold rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-casino-dark" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-casino-light">Vencedores da Semana</h3>
            <p className="text-casino-light/60 text-sm">Top 3 ganhadores</p>
          </div>
        </div>
        <div className="space-y-3">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div key={index} className="casino-glass rounded-lg p-3 hover:bg-casino-quaternary/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-casino-quaternary/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{player.avatar}</span>
                  </div>
                  <span className="font-bold text-casino-light">{player.name}</span>
                </div>
                <span className="text-casino-gold font-bold">{player.winnings}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full bg-casino-quaternary/20 hover:bg-casino-gold hover:text-casino-dark text-casino-light font-bold py-3 rounded-xl mt-4 transition-all duration-200 border border-casino-quaternary hover:border-casino-gold">
          VER RANKING COMPLETO
        </button>
      </div>

      {/* Card Como Funciona */}
      <div className="casino-glass rounded-2xl p-6 casino-glow-secondary hover:scale-105 transition-all duration-300">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-casino-cyan rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-casino-dark" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-casino-light">Como Funciona?</h3>
            <p className="text-casino-light/60 text-sm">Guia rápido</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-casino-gradient rounded-full flex items-center justify-center text-sm font-bold text-casino-dark casino-glow-gold">1</div>
            <span className="text-casino-light font-medium">Compre seus bilhetes</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-casino-gradient rounded-full flex items-center justify-center text-sm font-bold text-casino-dark casino-glow-gold">2</div>
            <span className="text-casino-light font-medium">Aguarde o sorteio</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-casino-gradient rounded-full flex items-center justify-center text-sm font-bold text-casino-dark casino-glow-gold">3</div>
            <span className="text-casino-light font-medium">Ganhe prêmios!</span>
          </div>
        </div>
        <button className="w-full bg-casino-quaternary/20 hover:bg-casino-cyan hover:text-casino-dark text-casino-cyan font-bold py-3 rounded-xl mt-6 transition-all duration-200 border border-casino-cyan">
          SAIBA MAIS
        </button>
      </div>
    </div>
  );
}