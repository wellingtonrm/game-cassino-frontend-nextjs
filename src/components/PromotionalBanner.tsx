'use client';

import { Gift } from 'lucide-react';

interface PromotionalBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const PromotionalBanner = ({ 
  title = "Promoção Especial!",
  description = "Compre 5 bilhetes e ganhe 2 grátis! Válido até meia-noite.",
  buttonText = "Aproveitar",
  onButtonClick,
  className = ''
}: PromotionalBannerProps) => {
  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      console.log('Promoção clicada!');
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 bg-gradient-to-r from-orange-500/60 to-red-500/60 border border-orange-500/30 rounded-xl p-3 backdrop-blur-xl ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gift className="w-6 h-6 text-orange-400" />
          <div>
            <h3 className="font-bold text-sm text-zinc-100">{title}</h3>
            <p className="text-xs text-zinc-200">{description}</p>
          </div>
        </div>
        <button 
          onClick={handleClick}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 py-1 rounded-lg text-sm transition-all duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;