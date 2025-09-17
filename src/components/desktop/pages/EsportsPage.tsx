'use client'

import React, { useState } from 'react'
import { Search, Filter, Calendar, Trophy, Users, Clock, TrendingUp } from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface EsportsPageProps {
  onMatchSelect?: (matchId: string) => void
}

interface Match {
  id: string
  sport: string
  league: string
  team1: {
    name: string
    logo: string
    odds: number
  }
  team2: {
    name: string
    logo: string
    odds: number
  }
  startTime: Date
  status: 'upcoming' | 'live' | 'finished'
  isPopular: boolean
  viewers?: number
}

interface Tournament {
  id: string
  name: string
  game: string
  prize: string
  teams: number
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'ongoing' | 'finished'
}

const sportsCategories = [
  { id: 'all', name: 'Todos', icon: null },
  { id: 'lol', name: 'League of Legends', icon: Trophy },
  { id: 'csgo', name: 'CS:GO', icon: Users },
  { id: 'dota2', name: 'Dota 2', icon: TrendingUp },
  { id: 'valorant', name: 'Valorant', icon: Clock }
]

const mockMatches: Match[] = [
  {
    id: '1',
    sport: 'lol',
    league: 'LCS',
    team1: { name: 'Team Liquid', logo: '/teams/tl.png', odds: 1.85 },
    team2: { name: 'Cloud9', logo: '/teams/c9.png', odds: 1.95 },
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'upcoming',
    isPopular: true,
    viewers: 45000
  },
  {
    id: '2',
    sport: 'csgo',
    league: 'ESL Pro League',
    team1: { name: 'Astralis', logo: '/teams/astralis.png', odds: 2.10 },
    team2: { name: 'NAVI', logo: '/teams/navi.png', odds: 1.75 },
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    status: 'upcoming',
    isPopular: true,
    viewers: 32000
  },
  {
    id: '3',
    sport: 'valorant',
    league: 'VCT',
    team1: { name: 'Sentinels', logo: '/teams/sen.png', odds: 1.65 },
    team2: { name: 'OpTic Gaming', logo: '/teams/optic.png', odds: 2.25 },
    startTime: new Date(Date.now() - 30 * 60 * 1000),
    status: 'live',
    isPopular: true,
    viewers: 28000
  }
]

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'World Championship',
    game: 'League of Legends',
    prize: '$2,225,000',
    teams: 24,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Major Championship',
    game: 'CS:GO',
    prize: '$1,000,000',
    teams: 16,
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'ongoing'
  }
]

export default function EsportsPage({ onMatchSelect }: EsportsPageProps) {
  const [activeTab, setActiveTab] = useState<'matches' | 'tournaments'>('matches')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMatches = mockMatches.filter(match => {
    const matchesCategory = selectedCategory === 'all' || match.sport === selectedCategory
    const matchesSearch = match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.league.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const liveMatches = filteredMatches.filter(match => match.status === 'live')
  const upcomingMatches = filteredMatches.filter(match => match.status === 'upcoming')

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }




  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.secondary }}>
          Esports
        </h1>
        <p className="text-lg" style={{ color: colors.mediumGray }}>
          Aposte nos seus times favoritos
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.mediumGray + '20' }}>
          {[
            { id: 'matches', name: 'Partidas', icon: Users },
            { id: 'tournaments', name: 'Torneios', icon: Trophy }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <RippleButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'matches' | 'tournaments')}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg transition-all",
                  activeTab === tab.id && "shadow-sm"
                )}
                style={{
                  backgroundColor: activeTab === tab.id ? colors.secondary : 'transparent',
                  color: activeTab === tab.id ? colors.primary : colors.mediumGray
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.name}</span>
              </RippleButton>
            )
          })}
        </div>
      </div>

      {activeTab === 'matches' && (
        <>
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
                  placeholder="Buscar partidas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.mediumGray + '40',
                    color: colors.secondary
                  }}
                />
              </div>

              {/* Filter Button */}
              <RippleButton
                className="flex items-center space-x-2 px-4 py-3 rounded-lg border hover:scale-105 transition-transform"
                style={{
                  backgroundColor: colors.mediumGray + '20',
                  borderColor: colors.mediumGray + '40',
                  color: colors.mediumGray
                }}
              >
                <Filter size={20} />
                <span>Filtros</span>
              </RippleButton>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mt-6">
              {sportsCategories.map(category => {
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
                        : colors.mediumGray
                    }}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{category.name}</span>
                  </RippleButton>
                )
              })}
            </div>
          </div>

          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: colors.secondary }}>
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Ao Vivo
              </h2>
              <div className="space-y-4">
                {liveMatches.map(match => (
                  <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
              Próximas Partidas
            </h2>
            {upcomingMatches.length === 0 ? (
              <div 
                className="text-center py-12 rounded-lg border"
                style={{
                  backgroundColor: colors.mediumGray + '10',
                  borderColor: colors.mediumGray + '20'
                }}
              >
                <p className="text-lg" style={{ color: colors.mediumGray }}>
                  Nenhuma partida encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} onSelect={onMatchSelect} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'tournaments' && (
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
            Torneios
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockTournaments.map(tournament => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Match Card Component
function MatchCard({ match, onSelect }: { match: Match, onSelect?: (matchId: string) => void }) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  return (
    <div 
      className="p-6 rounded-xl border hover:scale-[1.02] transition-transform cursor-pointer"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '20'
      }}
      onClick={() => onSelect?.(match.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span 
            className="px-2 py-1 rounded-full text-xs font-bold uppercase"
            style={{
              backgroundColor: match.status === 'live' ? '#ef4444' : colors.secondary + '20',
              color: match.status === 'live' ? 'white' : colors.secondary
            }}
          >
            {match.status === 'live' ? 'AO VIVO' : 'PRÓXIMA'}
          </span>
          <span className="text-sm font-medium" style={{ color: colors.mediumGray }}>
            {match.league}
          </span>
        </div>
        
        {match.viewers && (
          <div className="flex items-center space-x-1 text-sm" style={{ color: colors.mediumGray }}>
            <Users size={16} />
            <span>{match.viewers.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="flex-1 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.secondary + '20' }}
          >
            <span className="text-2xl font-bold" style={{ color: colors.secondary }}>
              {match.team1.name.charAt(0)}
            </span>
          </div>
          <h3 className="font-bold mb-1" style={{ color: colors.secondary }}>
            {match.team1.name}
          </h3>
          <RippleButton
            className="px-4 py-2 rounded-lg border hover:scale-105 transition-transform"
            style={{
              backgroundColor: colors.secondary + '20',
              borderColor: colors.secondary + '40',
              color: colors.secondary
            }}
          >
            {match.team1.odds.toFixed(2)}
          </RippleButton>
        </div>

        {/* VS and Time */}
        <div className="flex-1 text-center px-4">
          <div className="text-2xl font-bold mb-2" style={{ color: colors.mediumGray }}>
            VS
          </div>
          <div className="text-sm" style={{ color: colors.mediumGray }}>
            {match.status === 'live' ? 'AO VIVO' : formatTime(match.startTime)}
          </div>
          <div className="text-xs mt-1" style={{ color: colors.mediumGray }}>
            {match.status !== 'live' && formatDate(match.startTime)}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.accent + '20' }}
          >
            <span className="text-2xl font-bold" style={{ color: colors.accent }}>
              {match.team2.name.charAt(0)}
            </span>
          </div>
          <h3 className="font-bold mb-1" style={{ color: colors.secondary }}>
            {match.team2.name}
          </h3>
          <RippleButton
            className="px-4 py-2 rounded-lg border hover:scale-105 transition-transform"
            style={{
              backgroundColor: colors.accent + '20',
              borderColor: colors.accent + '40',
              color: colors.accent
            }}
          >
            {match.team2.odds.toFixed(2)}
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

// Tournament Card Component
function TournamentCard({ tournament }: { tournament: Tournament }) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  return (
    <div 
      className="p-6 rounded-xl border"
      style={{
        backgroundColor: colors.mediumGray + '10',
        borderColor: colors.mediumGray + '20'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1" style={{ color: colors.secondary }}>
            {tournament.name}
          </h3>
          <p className="text-sm" style={{ color: colors.mediumGray }}>
            {tournament.game}
          </p>
        </div>
        
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold uppercase"
          style={{
            backgroundColor: tournament.status === 'ongoing' 
              ? colors.accent + '20' 
              : colors.secondary + '20',
            color: tournament.status === 'ongoing' 
              ? colors.accent 
              : colors.secondary
          }}
        >
          {tournament.status === 'ongoing' ? 'EM ANDAMENTO' : 
           tournament.status === 'upcoming' ? 'EM BREVE' : 'FINALIZADO'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span style={{ color: colors.mediumGray }}>Prêmio:</span>
          <span className="font-bold" style={{ color: colors.accent }}>
            {tournament.prize}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span style={{ color: colors.mediumGray }}>Times:</span>
          <span className="font-medium" style={{ color: colors.secondary }}>
            {tournament.teams}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span style={{ color: colors.mediumGray }}>Período:</span>
          <span className="font-medium" style={{ color: colors.secondary }}>
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </span>
        </div>
      </div>

      <RippleButton
        className="w-full mt-4 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
        style={{
          backgroundColor: colors.secondary,
          color: colors.primary
        }}
      >
        Ver Detalhes
      </RippleButton>
    </div>
  )
}