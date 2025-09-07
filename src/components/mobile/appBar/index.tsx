"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { RippleButton } from '@/components/ui/RippleButton';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '@/hooks/useAuth';

interface AppBarProps {
  balance?: number;
  onOpenWallet?: () => void;
  className?: string;
}

const AppBar: React.FC<AppBarProps> = ({ 
  balance = 0, 
  onOpenWallet,
  className 
}) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  // Formatar saldo com 2 casas decimais
  const formatBalance = (value: number) => {
    return value.toFixed(2);
  };

  // Definição dos itens de menu removida conforme solicitado

 
  return (
    <header className={cn(
      "bg-[#1a1a2e] border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50",
      className
    )}>
   
      
      {/* Logo */}
      <Logo size="md" />
      
      {/* Ações do Cabeçalho */}
      <div className="flex items-center gap-3">
        {/* Saldo com ícone de USDT */}
        <RippleButton 
          onClick={onOpenWallet}
          className="flex items-center gap-2 bg-[#2a2a3e] hover:bg-[#32324a] rounded-lg px-3 py-2 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center">
            <span className="text-xs font-bold text-white">₮</span>
          </div>
          <span className="text-sm font-mono">{isAuthenticated ? formatBalance(balance) : '0.00'}</span>
          <ChevronDown className="w-4 h-4" />
        </RippleButton>
        
        {/* Botão de Notificações */}
        <RippleButton className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
          <Bell className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </RippleButton>
        

      </div>
    </header>
  );
};

export default AppBar;