'use client'

import React, { useState } from 'react'
import { Search, Filter, TrendingUp, Star, Users, Clock } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface CassinoPageProps {
  onGameSelect?: (gameId: string) => void
}

interface GameCard {
  id: string
  name: string
  category: string
  image: string
  isPopular: boolean
  isNew: boolean
  players: number
  rtp: number
  minBet: number
  maxBet: number
}

const gameCategories = [
  { id: 'all', name: 'Todos', icon: null },
  { id: 'slots', name: 'Slots', icon: Star },
  { id: 'table', name: 'Mesa', icon: Users },
  { id: 'live', name: 'Ao Vivo', icon: Clock },
  { id: 'crash', name: 'Crash', icon: TrendingUp }
]

const mockGames: GameCard[] = [
  {
    id: 'mines',
    name: 'Mines',
    category: 'crash',
    image: '/games/mines.jpg',
    isPopular: true,
    isNew: false,
    players: 1234,
    rtp: 97.5,
    minBet: 0.1,
    maxBet: 1000
  },
  {
    id: 'plinko',
    name: 'Plinko',
    category: 'crash',
    image: '/games/plinko.jpg',
    isPopular: true,
    isNew: false,
    players: 856,
    rtp: 98.2,
    minBet: 0.1,
    maxBet: 1000
  },
  {
    id: 'aviator',
    name: 'Aviator',
    category: 'crash',
    image: '/games/aviator.jpg',
    isPopular: true,
    isNew: false,
    players: 2341,
    rtp: 97.0,
    minBet: 0.1,
    maxBet: 1000
  },
  {
    id: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    category: 'slots',
    image: '/games/sweet-bonanza.jpg',
    isPopular: false,
    isNew: true,
    players: 567,
    rtp: 96.5,
    minBet: 0.2,
    maxBet: 500
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    category: 'table',
    image: '/games/blackjack.jpg',
    isPopular: false,
    isNew: false,
    players: 234,
    rtp: 99.5,
    minBet: 1,
    maxBet: 5000
  },
  {
    id: 'roulette',
    name: 'Roulette',
    category: 'live',
    image: '/games/roulette.jpg',
    isPopular: true,
    isNew: false,
    players: 789,
    rtp: 97.3,
    minBet: 0.5,
    maxBet: 10000
  }
]

export default function CassinoPage({ onGameSelect }: CassinoPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredGames = mockGames.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularGames = mockGames.filter(game => game.isPopular)
  const newGames = mockGames.filter(game => game.isNew)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.secondary }}>
          Cassino
        </h1>
        <p className="text-lg" style={{ color: colors.mediumGray }}>
          Explore nossa coleção de jogos de cassino
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: colors.mediumGray }}
            />
            <input
              type="text"
              placeholder="Buscar jogos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '40',
                color: colors.secondary,
              }}
            />
          </div>

          {/* Filter Button */}
          <RippleButton
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 rounded-lg border hover:scale-105 transition-transform"
            style={{
              backgroundColor: showFilters ? colors.secondary + '20' : colors.mediumGray + '20',
              borderColor: showFilters ? colors.secondary + '40' : colors.mediumGray + '40',
              color: showFilters ? colors.secondary : colors.mediumGray
            }}
          >
            <Filter size={20} />
            <span>Filtros</span>
          </RippleButton>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {gameCategories.map(category => {
            const Icon = category.icon
            return (
              <RippleButton
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg border hover:scale-105 transition-transform",
                  selectedCategory === category.id && "ring-2"
                )}
                style={{
                  backgroundColor: selectedCategory === category.id 
                    ? colors.secondary + '20' 
                    : colors.mediumGray + '20',
                  borderColor: selectedCategory === category.id 
                    ? colors.secondary + '40' 
                    : colors.mediumGray + '40',
                  color: selectedCategory === category.id 
                    ? colors.secondary 
                    : colors.mediumGray,
                }}
              >
                {Icon && <Icon size={16} />}
                <span>{category.name}</span>
              </RippleButton>
            )
          })}
        </div>
      </div>

      {/* Popular Games Section */}
      {selectedCategory === 'all' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
            Jogos Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularGames.map(game => (
              <GameCardComponent 
                key={game.id} 
                game={game} 
                onSelect={onGameSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* New Games Section */}
      {selectedCategory === 'all' && newGames.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
            Novos Jogos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newGames.map(game => (
              <GameCardComponent 
                key={game.id} 
                game={game} 
                onSelect={onGameSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Games Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
          {selectedCategory === 'all' ? 'Todos os Jogos' : `Jogos - ${gameCategories.find(c => c.id === selectedCategory)?.name}`}
        </h2>
        
        {filteredGames.length === 0 ? (
          <div 
            className="text-center py-12 rounded-lg border"
            style={{
              backgroundColor: colors.mediumGray + '10',
              borderColor: colors.mediumGray + '20'
            }}
          >
            <p className="text-lg" style={{ color: colors.mediumGray }}>
              Nenhum jogo encontrado
            </p>
            <p className="text-sm mt-2" style={{ color: colors.mediumGray }}>
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <GameCardComponent 
                key={game.id} 
                game={game} 
                onSelect={onGameSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Game Card Component
function GameCardComponent({ game, onSelect }: { game: GameCard, onSelect?: (gameId: string) => void }) {
  return (
    <div 
      className="group relative rounded-xl border overflow-hidden hover:scale-105 transition-transform cursor-pointer"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '20'
      }}
      onClick={() => onSelect?.(game.id)}
    >
      {/* Game Image */}
      <div 
        className="h-48 bg-gradient-to-br from-purple-500 to-pink-500 relative"
        style={{
          background: `linear-gradient(135deg, ${colors.secondary}40, ${colors.accent}40)`
        }}
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 flex space-x-1">
          {game.isPopular && (
            <span 
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary
              }}
            >
              Popular
            </span>
          )}
          {game.isNew && (
            <span 
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: colors.secondary,
                color: colors.primary
              }}
            >
              Novo
            </span>
          )}
        </div>

        {/* Players Count */}
        <div className="absolute top-2 right-2">
          <div 
            className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs"
            style={{
              backgroundColor: colors.primary + '80',
              color: colors.secondary
            }}
          >
            <Users size={12} />
            <span>{game.players}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100"
            style={{ backgroundColor: colors.secondary }}
          >
            <div 
              className="w-0 h-0 border-l-8 border-r-0 border-t-6 border-b-6 border-transparent ml-1"
              style={{ 
                borderLeftColor: colors.primary,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent'
              }}
            />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2" style={{ color: colors.secondary }}>
          {game.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: colors.mediumGray }}>RTP:</span>
            <span className="font-medium" style={{ color: colors.secondary }}>
              {game.rtp}%
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span style={{ color: colors.mediumGray }}>Min/Max:</span>
            <span className="font-medium" style={{ color: colors.secondary }}>
              ${game.minBet} - ${game.maxBet}
            </span>
          </div>
        </div>

        {/* Play Button */}
        <RippleButton
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.(game.id)
          }}
          className="w-full mt-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
          style={{
            backgroundColor: colors.secondary,
            color: colors.primary
          }}
        >
          Jogar Agora
        </RippleButton>
      </div>
    </div>
  )
}