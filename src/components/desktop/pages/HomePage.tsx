'use client'

import React from 'react'
import { TrendingUp, Trophy, Target, Zap, Crown, Settings, Play, Star, Users, DollarSign } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface HomePageProps {
  onNavigateToGame?: (game: string) => void
}

const gameCards = [
  {
    id: 'mines',
    title: 'Mines',
    description: 'Encontre os diamantes e evite as minas',
    icon: Target,
    gradient: 'from-purple-600 to-purple-800',
    multiplier: '2.5x'
  },
  {
    id: 'plinko',
    title: 'Plinko',
    description: 'Deixe a bola cair e ganhe prêmios',
    icon: Zap,
    gradient: 'from-blue-600 to-blue-800',
    multiplier: '1000x'
  },
  {
    id: 'crash',
    title: 'Crash',
    description: 'Aposte e retire antes do crash',
    icon: TrendingUp,
    gradient: 'from-red-600 to-red-800',
    multiplier: '∞'
  },
  {
    id: 'roulette',
    title: 'Roleta',
    description: 'Gire a roleta da sorte',
    icon: Crown,
    gradient: 'from-green-600 to-green-800',
    multiplier: '35x'
  }
]

const stats = [
  { label: 'Jogadores Online', value: '1,234', icon: Users },
  { label: 'Jackpot Atual', value: '$12,345', icon: DollarSign },
  { label: 'Jogos Hoje', value: '5,678', icon: Play },
  { label: 'Taxa de Vitória', value: '94.5%', icon: Star }
]

export default function HomePage({ onNavigateToGame }: HomePageProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: colors.secondary }}>
          Bem-vindo ao PolDex Casino
        </h1>
        <p className="text-lg" style={{ color: colors.mediumGray }}>
          A melhor experiência de cassino online com jogos premium
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: colors.mediumGray + '10',
                borderColor: colors.mediumGray + '20'
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: colors.mediumGray }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1" style={{ color: colors.secondary }}>
                    {stat.value}
                  </p>
                </div>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary + '20' }}
                >
                  <Icon size={24} style={{ color: colors.secondary }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Featured Games */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
            Jogos em Destaque
          </h2>
          <RippleButton
            className="px-4 py-2 rounded-lg border hover:scale-105 transition-transform"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '30',
              color: colors.mediumGray
            }}
          >
            Ver Todos
          </RippleButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameCards.map((game) => {
            const Icon = game.icon
            return (
              <RippleButton
                key={game.id}
                onClick={() => onNavigateToGame?.(game.id)}
                className="group relative overflow-hidden rounded-xl border hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: colors.mediumGray + '10',
                  borderColor: colors.mediumGray + '20'
                }}
              >
                {/* Background Gradient */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary}40 0%, ${colors.accent}40 100%)`
                  }}
                />
                
                {/* Content */}
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.secondary + '20' }}
                    >
                      <Icon size={24} style={{ color: colors.secondary }} />
                    </div>
                    <div 
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: colors.accent + '20',
                        color: colors.accent
                      }}
                    >
                      {game.multiplier}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.secondary }}>
                      {game.title}
                    </h3>
                    <p className="text-sm" style={{ color: colors.mediumGray }}>
                      {game.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center pt-2">
                    <Play size={16} style={{ color: colors.secondary }} />
                    <span className="ml-2 text-sm font-medium" style={{ color: colors.secondary }}>
                      Jogar Agora
                    </span>
                  </div>
                </div>
              </RippleButton>
            )
          })}
        </div>
      </div>

      {/* Promotions Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
          Promoções Especiais
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Welcome Bonus */}
          <div 
            className="p-6 rounded-xl border relative overflow-hidden"
            style={{
              backgroundColor: colors.secondary + '10',
              borderColor: colors.secondary + '30'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy size={24} style={{ color: colors.secondary }} />
                <h3 className="text-xl font-bold" style={{ color: colors.secondary }}>
                  Bônus de Boas-vindas
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: colors.mediumGray }}>
                Ganhe até 200% no seu primeiro depósito + 50 giros grátis
              </p>
              <RippleButton
                className="px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary
                }}
              >
                Resgatar Agora
              </RippleButton>
            </div>
          </div>

          {/* Daily Rewards */}
          <div 
            className="p-6 rounded-xl border relative overflow-hidden"
            style={{
              backgroundColor: colors.accent + '10',
              borderColor: colors.accent + '30'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <Star size={24} style={{ color: colors.accent }} />
                <h3 className="text-xl font-bold" style={{ color: colors.accent }}>
                  Recompensas Diárias
                </h3>
              </div>
              <p className="text-sm mb-4" style={{ color: colors.mediumGray }}>
                Entre todos os dias e ganhe recompensas exclusivas
              </p>
              <RippleButton
                className="px-4 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                Coletar Hoje
              </RippleButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}