'use client';

import { Bell, User, Wallet, Ticket } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Painel da Loteria
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <button className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        {/* Perfil do Usuário */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg px-3 py-2 border border-purple-500/30">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Jogador123</p>
            <p className="text-xs text-gray-400">Nível 15</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Wallet className="w-3 h-3 text-green-400" />
              <span className="font-bold text-green-400 text-sm">R$ 2.450</span>
            </div>
            <div className="flex items-center space-x-1">
              <Ticket className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400">12 bilhetes</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}