'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>
            
            <div className="h-6 w-px bg-white/20" />
            
            <h1 className="text-2xl font-bold text-white">
              🎯 Plinko Casino
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              Jogo de sorte e estratégia
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}