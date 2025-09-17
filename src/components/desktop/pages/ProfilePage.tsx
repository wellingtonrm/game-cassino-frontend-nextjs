'use client'

import React, { useState } from 'react'
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  History,
  Award,
  Users,
  Eye,
  EyeOff,
  Edit3,
  Camera,
  Save,
  X,
  Trophy
} from 'lucide-react'
import { RippleButton } from '@/components/ui/RippleButton'
import { colors } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface ProfilePageProps {
  onSettingsChange?: (setting: string, value: any) => void
}

interface UserProfile {
  id: string
  username: string
  email: string
  avatar?: string
  level: number
  xp: number
  xpToNext: number
  joinDate: Date
  totalBets: number
  totalWins: number
  totalWinnings: number
  winRate: number
  favoriteGame: string
  isVip: boolean
  kycStatus: 'pending' | 'verified' | 'rejected'
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

const mockProfile: UserProfile = {
  id: '1',
  username: 'PlayerOne',
  email: 'player@example.com',
  level: 15,
  xp: 2450,
  xpToNext: 550,
  joinDate: new Date('2023-01-15'),
  totalBets: 1234,
  totalWins: 567,
  totalWinnings: 12345.67,
  winRate: 45.9,
  favoriteGame: 'Mines',
  isVip: true,
  kycStatus: 'verified'
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Primeiro Passo',
    description: 'Faça sua primeira aposta',
    icon: '🎯',
    unlockedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Sortudo',
    description: 'Ganhe 10 apostas seguidas',
    icon: '🍀',
    unlockedAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'High Roller',
    description: 'Aposte mais de $1000 em uma única aposta',
    icon: '💎',
    progress: 750,
    maxProgress: 1000
  },
  {
    id: '4',
    name: 'Veterano',
    description: 'Jogue por 100 dias',
    icon: '⭐',
    progress: 87,
    maxProgress: 100
  }
]

export default function ProfilePage({ onSettingsChange }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'achievements' | 'settings'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(mockProfile)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const handleSaveProfile = () => {
    // Here you would save the profile changes
    setIsEditing(false)
    // onSettingsChange?.('profile', editedProfile)
  }

  const handleCancelEdit = () => {
    setEditedProfile(mockProfile)
    setIsEditing(false)
  }

  const getXpPercentage = () => {
    return (mockProfile.xp / (mockProfile.xp + mockProfile.xpToNext)) * 100
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.secondary }}>
          Perfil
        </h1>
        <p className="text-lg" style={{ color: colors.mediumGray }}>
          Gerencie seu perfil e configurações
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.mediumGray + '20' }}>
          {[
            { id: 'profile', name: 'Perfil', icon: User },
            { id: 'stats', name: 'Estatísticas', icon: Award },
            { id: 'achievements', name: 'Conquistas', icon: Trophy },
            { id: 'settings', name: 'Configurações', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <RippleButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
                <span className="font-medium hidden sm:inline">{tab.name}</span>
              </RippleButton>
            )
          })}
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <div 
            className="p-8 rounded-xl border relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent}20)`,
              borderColor: colors.mediumGray + '20'
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold"
                  style={{
                    backgroundColor: colors.secondary + '20',
                    color: colors.secondary
                  }}
                >
                  {mockProfile.avatar ? (
                    <img src={mockProfile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    mockProfile.username.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <RippleButton
                    className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.primary
                    }}
                  >
                    <Camera size={20} />
                  </RippleButton>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.username}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, username: e.target.value }))}
                        className="text-3xl font-bold bg-transparent border-b-2 focus:outline-none"
                        style={{
                          color: colors.secondary,
                          borderColor: colors.secondary + '40'
                        }}
                      />
                    ) : (
                      <h2 className="text-3xl font-bold" style={{ color: colors.secondary }}>
                        {mockProfile.username}
                      </h2>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: mockProfile.isVip ? colors.accent : colors.secondary + '20',
                          color: mockProfile.isVip ? colors.primary : colors.secondary
                        }}
                      >
                        {mockProfile.isVip ? 'VIP' : 'Regular'}
                      </span>
                      
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-bold"
                        style={{
                          backgroundColor: mockProfile.kycStatus === 'verified' ? '#10b981' + '20' : '#f59e0b' + '20',
                          color: mockProfile.kycStatus === 'verified' ? '#10b981' : '#f59e0b'
                        }}
                      >
                        {mockProfile.kycStatus === 'verified' ? 'Verificado' : 'Pendente'}
                      </span>
                    </div>
                  </div>

                  <RippleButton
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: isEditing ? colors.accent : colors.secondary + '20',
                      color: isEditing ? colors.primary : colors.secondary
                    }}
                  >
                    {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
                    <span>{isEditing ? 'Salvar' : 'Editar'}</span>
                  </RippleButton>
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: colors.secondary }}>
                      Nível {mockProfile.level}
                    </span>
                    <span className="text-sm" style={{ color: colors.mediumGray }}>
                      {mockProfile.xp} / {mockProfile.xp + mockProfile.xpToNext} XP
                    </span>
                  </div>
                  <div 
                    className="w-full h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.mediumGray + '20' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent,
                        width: `${getXpPercentage()}%`
                      }}
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.mediumGray }}>
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: colors.primary,
                          borderColor: colors.mediumGray + '40',
                          color: colors.secondary
                        }}
                      />
                    ) : (
                      <p style={{ color: colors.secondary }}>{mockProfile.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.mediumGray }}>
                      Membro desde
                    </label>
                    <p style={{ color: colors.secondary }}>
                      {mockProfile.joinDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="absolute top-4 right-4">
                <RippleButton
                  onClick={handleCancelEdit}
                  className="p-2 rounded-lg hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: colors.mediumGray + '20',
                    color: colors.mediumGray
                  }}
                >
                  <X size={20} />
                </RippleButton>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total de Apostas', value: mockProfile.totalBets.toLocaleString(), icon: History },
              { label: 'Total de Vitórias', value: mockProfile.totalWins.toLocaleString(), icon: Award },
              { label: 'Ganhos Totais', value: `$${mockProfile.totalWinnings.toFixed(2)}`, icon: CreditCard, sensitive: true },
              { label: 'Taxa de Vitória', value: `${mockProfile.winRate}%`, icon: Users }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border"
                style={{
                  backgroundColor: colors.mediumGray + '10',
                  borderColor: colors.mediumGray + '20'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={24} style={{ color: colors.secondary }} />
                  {stat.sensitive && (
                    <RippleButton
                      onClick={() => setShowSensitiveData(!showSensitiveData)}
                      className="p-1 rounded hover:scale-110 transition-transform"
                      style={{ color: colors.mediumGray }}
                    >
                      {showSensitiveData ? <Eye size={16} /> : <EyeOff size={16} />}
                    </RippleButton>
                  )}
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>
                  {stat.sensitive && !showSensitiveData ? '••••••' : stat.value}
                </p>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <StatsSection profile={mockProfile} showSensitive={showSensitiveData} />
      )}

      {activeTab === 'achievements' && (
        <AchievementsSection achievements={mockAchievements} />
      )}

      {activeTab === 'settings' && (
        <SettingsSection onSettingsChange={onSettingsChange} />
      )}
    </div>
  )
}

// Stats Section Component
function StatsSection({ profile, showSensitive }: { profile: UserProfile, showSensitive: boolean }) {
  return (
    <div className="space-y-8">
      {/* Detailed Stats */}
      <div>
        <h3 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
          Estatísticas Detalhadas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Jogo Favorito', value: profile.favoriteGame },
            { label: 'Maior Vitória', value: showSensitive ? '$2,500.00' : '••••••' },
            { label: 'Sequência de Vitórias', value: '12' },
            { label: 'Tempo Total Jogado', value: '156h 32m' },
            { label: 'Apostas Hoje', value: '23' },
            { label: 'Ganhos Hoje', value: showSensitive ? '$145.67' : '••••••' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: colors.mediumGray + '10',
                borderColor: colors.mediumGray + '20'
              }}
            >
              <p className="text-2xl font-bold mb-1" style={{ color: colors.secondary }}>
                {stat.value}
              </p>
              <p className="text-sm" style={{ color: colors.mediumGray }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Game History Chart Placeholder */}
      <div 
        className="p-8 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h4 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>
          Histórico de Ganhos (Últimos 30 dias)
        </h4>
        <div 
          className="h-64 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.mediumGray + '20' }}
        >
          <p style={{ color: colors.mediumGray }}>
            Gráfico de ganhos seria exibido aqui
          </p>
        </div>
      </div>
    </div>
  )
}

// Achievements Section Component
function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold" style={{ color: colors.secondary }}>
        Conquistas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={cn(
              "p-6 rounded-xl border",
              achievement.unlockedAt ? "hover:scale-105" : "opacity-75"
            )}
            style={{
              backgroundColor: achievement.unlockedAt 
                ? colors.accent + '10' 
                : colors.mediumGray + '10',
              borderColor: achievement.unlockedAt 
                ? colors.accent + '20' 
                : colors.mediumGray + '20'
            }}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h4 className="font-bold text-lg mb-2" style={{ color: colors.secondary }}>
                {achievement.name}
              </h4>
              <p className="text-sm mb-4" style={{ color: colors.mediumGray }}>
                {achievement.description}
              </p>
              
              {achievement.unlockedAt ? (
                <div 
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.primary
                  }}
                >
                  Desbloqueado em {achievement.unlockedAt.toLocaleDateString('pt-BR')}
                </div>
              ) : achievement.progress !== undefined && achievement.maxProgress !== undefined ? (
                <div>
                  <div className="flex justify-between text-sm mb-2" style={{ color: colors.mediumGray }}>
                    <span>Progresso</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.mediumGray + '20' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: colors.secondary,
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div 
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.mediumGray + '20',
                    color: colors.mediumGray
                  }}
                >
                  Bloqueado
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Settings Section Component
function SettingsSection({ onSettingsChange }: { onSettingsChange?: (setting: string, value: any) => void }) {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    twoFactor: true,
    publicProfile: false,
    language: 'pt-BR',
    currency: 'USD',
    theme: 'dark'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    onSettingsChange?.(key, value)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Security Settings */}
      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.secondary }}>
          <Shield size={24} className="mr-2" />
          Segurança
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium" style={{ color: colors.secondary }}>
                Autenticação de Dois Fatores
              </h4>
              <p className="text-sm" style={{ color: colors.mediumGray }}>
                Adicione uma camada extra de segurança
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => handleSettingChange('twoFactor', e.target.checked)}
                className="sr-only peer"
              />
              <div 
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{
                  backgroundColor: settings.twoFactor ? colors.accent : colors.mediumGray + '40'
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.secondary }}>
          <Bell size={24} className="mr-2" />
          Notificações
        </h3>
        
        <div className="space-y-4">
          {[
            { key: 'notifications', label: 'Notificações Push', desc: 'Receba notificações no navegador' },
            { key: 'emailUpdates', label: 'Atualizações por Email', desc: 'Receba novidades por email' }
          ].map(setting => (
            <div key={setting.key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium" style={{ color: colors.secondary }}>
                  {setting.label}
                </h4>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  {setting.desc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[setting.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div 
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{
                    backgroundColor: (settings[setting.key as keyof typeof settings] as boolean) ? colors.accent : colors.mediumGray + '40'
                  }}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div 
        className="p-6 rounded-xl border"
        style={{
          backgroundColor: colors.mediumGray + '10',
          borderColor: colors.mediumGray + '20'
        }}
      >
        <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.secondary }}>
          <Settings size={24} className="mr-2" />
          Preferências
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '40',
                color: colors.secondary
              }}
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>
              Moeda Padrão
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.mediumGray + '40',
                color: colors.secondary
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}