'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Gamepad2,
  User,
  ChevronUp,
  Dice6,
  Citrus,
  Wallet,
  Settings,
  UserCircle,
  CreditCard,
  LogOut,
  Ticket
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BottomNavigationBarProps {
  className?: string;
}

const gameItems = [
  { icon: Citrus, route: '/slot', label: 'Slots Premium', color: 'from-purple-500 to-violet-600' },
  { icon: Dice6, route: '/roleta', label: 'Roleta Clássica', color: 'from-rose-500 to-pink-600' },
  { icon: Ticket, route: '/raspadinha', label: 'Raspadinha', color: 'from-emerald-500 to-teal-600' }
];

const avatarItems = [
  { icon: Wallet, route: '/wallet', label: 'Carteira Digital' },
  { icon: UserCircle, route: '/perfil', label: 'Perfil' },
  { icon: Settings, route: '/config', label: 'Configurações' },
  { icon: CreditCard, route: '/withdraw', label: 'Sacar' },
  { icon: LogOut, route: '/logout', label: 'Sair' }
];

export default function BottomNavigationBar({ className = '' }: BottomNavigationBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const handleNavigation = (route: string) => {
    if (route === '/logout') {
      // Handle logout logic here
      console.log('Logout clicked');
      return;
    }
    router.push(route);
    setIsGamesOpen(false);
    setIsAvatarOpen(false);
  };

  const isHomeActive = pathname === '/';

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#00011f] via-slate-900/95 to-slate-800/95 backdrop-blur-xl border-t border-[#00011f]/30 ${className}`}>
        <div className="flex items-center justify-around py-3 px-4">
          {/* Home */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigation('/')}
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl transition-all duration-300 ${
              isHomeActive
                ? 'bg-gradient-to-r from-[#00011f] to-blue-600 text-white shadow-lg shadow-[#00011f]/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>

          {/* Games Menu */}
          <Sheet open={isGamesOpen} onOpenChange={setIsGamesOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="relative">
                  <Gamepad2 className="w-5 h-5" />
                  <ChevronUp className={`w-3 h-3 absolute -top-1 -right-1 transition-transform duration-300 ${
                    isGamesOpen ? 'rotate-180' : ''
                  }`} />
                </div>
                <span className="text-xs font-medium">Games</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="bg-gradient-to-t from-[#00011f] via-slate-900/95 to-slate-800/95 backdrop-blur-xl border-[#00011f]/30 rounded-t-2xl"
            >
              <SheetHeader className="pb-4">
                <SheetTitle className="text-white text-center">Escolha seu Jogo</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-3 pb-6">
                {gameItems.map((item, index) => {
                  const isActive = pathname === item.route;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleNavigation(item.route)}
                      className={`flex items-center gap-4 h-14 justify-start rounded-xl transition-all duration-300 border ${
                        isActive
                          ? `bg-gradient-to-r ${item.color} text-white border-white/20 shadow-lg shadow-current/20`
                          : 'bg-slate-800/30 hover:bg-slate-700/50 text-slate-300 hover:text-white border-slate-600/30 hover:border-slate-500/50'
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>

          {/* Avatar Menu */}
          <Sheet open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#00011f] to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronUp className={`w-3 h-3 absolute -top-1 -right-1 transition-transform duration-300 ${
                    isAvatarOpen ? 'rotate-180' : ''
                  }`} />
                </div>
                <span className="text-xs font-medium">Perfil</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="bottom" 
              className="bg-gradient-to-t from-[#00011f] via-slate-900/95 to-slate-800/95 backdrop-blur-xl border-[#00011f]/30 rounded-t-2xl"
            >
              <SheetHeader className="pb-4">
                <SheetTitle className="text-white text-center">Minha Conta</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 pb-6">
                {avatarItems.map((item, index) => {
                  const isActive = pathname === item.route;
                  const isLogout = item.route === '/logout';
                  return (
                    <div key={index}>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation(item.route)}
                        className={`w-full flex items-center gap-4 h-12 justify-start rounded-xl transition-all duration-300 ${
                          isLogout
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                            : isActive
                            ? 'bg-gradient-to-r from-[#00011f]/20 to-blue-600/20 text-white border border-[#00011f]/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                      {index < avatarItems.length - 1 && (
                        <Separator className="my-2 bg-slate-700/50" />
                      )}
                    </div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer para evitar que o conteúdo fique atrás da bottom bar */}
      <div className="h-20 lg:hidden" />
    </>
  );
}