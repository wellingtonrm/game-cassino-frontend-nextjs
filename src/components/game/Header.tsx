'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar</span>
            </Link>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <h1 className="text-2xl font-semibold text-gray-800">
              Plinko
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Jogo de sorte e estratégia
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}