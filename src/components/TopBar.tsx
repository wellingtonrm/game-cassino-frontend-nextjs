'use client';

import { Bell, User, Wallet, Ticket, Dice6, Citrus, ChevronDown, Settings, UserCircle, CreditCard, LogOut, Home, MessageCircle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useChatStore } from '@/stores/chatStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const gameItems = [
  { icon: Home, route: '/', label: 'Home', color: 'from-blue-500 to-indigo-600' },
  { icon: Citrus, route: '/slot', label: 'Slots Premium', color: 'from-purple-500 to-violet-600' },
  { icon: Dice6, route: '/roleta', label: 'Roleta Clássica', color: 'from-rose-500 to-pink-600' },
  { icon: Ticket, route: '/raspadinha', label: 'Raspadinha', color: 'from-emerald-500 to-teal-600' }
];

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isVisible: isChatVisible, toggleVisibility } = useChatStore();

  const handleNavigation = (route: string) => {
    if (route === '/logout') {
      // Handle logout logic here
      console.log('Logout clicked');
      return;
    }
    router.push(route);
  };

  return (
    <TooltipProvider>
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Painel da Loteria
          </h1>
          
          {/* Ícones de Jogos - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2">
            {gameItems.map((item, index) => {
              const isActive = pathname === item.route;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation(item.route)}
                      className={`p-3 rounded-xl transition-all duration-300 border ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white border-white/20 shadow-lg shadow-current/20`
                          : 'bg-slate-800/30 hover:bg-slate-700/50 text-slate-400 hover:text-white border-slate-600/30 hover:border-slate-500/50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Toggle Chat - Desktop Only */}
          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleVisibility}
                  className={`relative p-2 rounded-lg transition-all duration-300 border ${
                    isChatVisible 
                      ? 'bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/50 text-blue-400' 
                      : 'bg-slate-800/50 hover:bg-slate-700/70 border-slate-600/30 hover:border-slate-500/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 transition-colors" />
                  {isChatVisible && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isChatVisible ? 'Ocultar Chat' : 'Mostrar Chat'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Notificações */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="relative p-2 bg-slate-800/50 hover:bg-slate-700/70 rounded-lg transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50">
                <Bell className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Perfil do Usuário com Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-3 bg-gradient-to-r from-[#00011f]/20 to-blue-600/20 hover:from-[#00011f]/30 hover:to-blue-600/30 rounded-lg px-3 py-2 border border-[#00011f]/30 hover:border-[#00011f]/50 transition-all duration-300 h-auto"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#00011f] to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-semibold text-sm text-white">Jogador123</p>
                  <p className="text-xs text-slate-400">Nível 15</p>
                </div>
                <div className="hidden md:block text-right">
                  <div className="flex items-center space-x-1">
                    <Wallet className="w-3 h-3 text-green-400" />
                    <span className="font-bold text-green-400 text-sm">R$ 2.450</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Ticket className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">12 bilhetes</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 shadow-2xl"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00011f] to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Jogador123</p>
                    <p className="text-xs text-slate-400">jogador123@email.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/wallet')}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Carteira Digital
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/perfil')}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/config')}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/withdraw')}
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Sacar
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-slate-700/50" />
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/logout')}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}