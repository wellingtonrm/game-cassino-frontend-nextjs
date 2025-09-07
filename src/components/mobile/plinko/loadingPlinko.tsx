import React from 'react';
import Image from 'next/image';

interface LoadingPlinkoProps {
  isLoading?: boolean;
}

export const LoadingPlinko: React.FC<LoadingPlinkoProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center z-50 rounded-lg h-[400px]">
      <div className="relative w-32 h-32 animate-pulse">
        <Image
          src="/plinko/images/plinko.png"
          alt="Plinko Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="mt-6 text-center">
        <div className="text-white text-lg font-semibold mb-2">Carregando Plinko</div>
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPlinko;