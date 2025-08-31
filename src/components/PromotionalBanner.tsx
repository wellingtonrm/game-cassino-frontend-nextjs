'use client';

import { Gift, Sparkles } from 'lucide-react';

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
    <div className={`fixed bottom-4 left-4 right-4 casino-glass border border-casino-gold/30 rounded-2xl p-4 backdrop-blur-xl casino-glow-gold ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-casino-gradient rounded-xl flex items-center justify-center casino-glow-gold">
            <Sparkles className="w-5 h-5 text-casino-dark" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-casino-light">{title}</h3>
            <p className="text-sm text-casino-light/80">{description}</p>
          </div>
        </div>
        <button 
          onClick={handleClick}
          className="bg-casino-gradient hover:scale-105 text-casino-dark font-bold px-6 py-2 rounded-xl transition-all duration-300 casino-glow-gold"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;