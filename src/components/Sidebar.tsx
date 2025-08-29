'use client';

import { Home as HomeIcon, Trophy, Ticket, Users, Settings } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = '' }: SidebarProps) => {
  const navigationItems = [
    { icon: HomeIcon, active: true, label: 'Início' },
    { icon: Trophy, active: false, label: 'Torneios' },
    { icon: Ticket, active: false, label: 'Bilhetes' },
    { icon: Users, active: false, label: 'Comunidade' },
    { icon: Settings, active: false, label: 'Configurações' }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-16 bg-gradient-to-b from-[#1a1b3a]/80 to-[#0A0F1E]/80 backdrop-blur-xl border-r border-purple-500/20 z-50 ${className}`}>
      <div className="flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <Logo />
        
        {/* Ícones de Navegação */}
        <nav className="flex flex-col space-y-3">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                item.active 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50' 
                  : 'bg-white/10 hover:bg-white/20 hover:shadow-lg hover:shadow-white/20'
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;