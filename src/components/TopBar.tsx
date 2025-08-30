'use client';

import { Bell, User, Wallet, Ticket, Dice6, Citrus, ChevronDown, Settings, UserCircle, CreditCard, LogOut, Home, MessageCircle, Target } from 'lucide-react';
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
import Logo from './Logo';

const gameItems = [
  { icon: Home, route: '/', label: 'Home' },
  { icon: Citrus, route: '/slot', label: 'Slots Premium' },
  { icon: Dice6, route: '/roleta', label: 'Roleta Clássica' },
  { icon: Ticket, route: '/raspadinha', label: 'Raspadinha' },
  { icon: Target, route: '/plinko', label: 'Plinko' }
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
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-8">
          <Logo/>
          
          {/* Ícones de Jogos - Desktop Only */}
          <div className="hidden lg:flex items-center gap-1">
            {gameItems.map((item, index) => {
              const isActive = pathname === item.route;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation(item.route)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
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
        
        <div className="flex items-center space-x-3">
          {/* Toggle Chat - Desktop Only */}
          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleVisibility}
                  className={`relative p-2 rounded-lg transition-all duration-200 ${
                    isChatVisible 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {isChatVisible && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
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
              <button className="relative p-2 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
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
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200 h-auto"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium text-sm text-white">Jogador123</p>
                  <p className="text-xs text-gray-400">Nível 15</p>
                </div>
                <div className="hidden md:block text-right">
                  <div className="flex items-center space-x-1">
                    <Wallet className="w-3 h-3 text-green-400" />
                    <span className="font-semibold text-green-400 text-sm">R$ 2.450</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Ticket className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-400">12 bilhetes</span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-gray-900/95 backdrop-blur-sm border-gray-700/30"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Jogador123</p>
                    <p className="text-xs text-gray-400">jogador123@email.com</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700/30" />
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/wallet')}
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Carteira Digital
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/perfil')}
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/config')}
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleNavigation('/withdraw')}
                className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Sacar
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-700/30" />
              
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