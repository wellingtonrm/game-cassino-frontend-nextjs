import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
  suffix?: string;
}

/**
 * NumberSelector Component - Android Material Design style
 * 
 * Custom number selector with +/- buttons in Android style.
 * Perfect for selecting number of rows, difficulty levels, etc.
 */
export const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  className,
  suffix,
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onValueChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onValueChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onValueChange(newValue);
    }
  };

  const canDecrement = value > min && !disabled;
  const canIncrement = value < max && !disabled;

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-xs text-gray-400 block">{label}</label>
      )}\n      \n      <div className="flex items-center bg-[#2a2a3e] rounded-lg border border-gray-600 overflow-hidden">
        {/* Botão de Diminuir */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          className={cn(
            'flex items-center justify-center w-10 h-9 transition-all duration-200',
            'hover:bg-gray-600 active:scale-95',
            canDecrement 
              ? 'text-white cursor-pointer' 
              : 'text-gray-500 cursor-not-allowed'
          )}
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Input do Valor */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            'flex-1 bg-transparent text-center text-white font-mono text-sm',
            'border-none outline-none focus:ring-0 disabled:opacity-50',
            'py-2 px-2'
          )}
        />

        {/* Sufixo (ex: "linhas") */}
        {suffix && (
          <span className="text-xs text-gray-400 px-2">{suffix}</span>
        )}

        {/* Botão de Aumentar */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          className={cn(
            'flex items-center justify-center w-10 h-9 transition-all duration-200',
            'hover:bg-gray-600 active:scale-95',
            canIncrement 
              ? 'text-white cursor-pointer' 
              : 'text-gray-500 cursor-not-allowed'
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Toggle horizontal para números (8-16 linhas)
interface HorizontalNumberToggleProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const HorizontalNumberToggle: React.FC<HorizontalNumberToggleProps> = ({
  value,
  onValueChange,
  min,
  max,
  label,
  className,
  disabled = false
}) => {
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-xs text-gray-400 block">{label}</label>
      )}
      
      {/* Container com scroll horizontal */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => onValueChange(num)}
              disabled={disabled}
              className={cn(
                'flex-shrink-0 min-w-[44px] h-9 rounded-lg font-medium text-sm transition-all duration-200',
                'border border-gray-600 active:scale-95',
                value === num
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/25'
                  : 'bg-[#2a2a3e] text-gray-300 hover:bg-gray-600 hover:text-white hover:border-gray-500',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {num}
            </button>
          ))}
        </div>
        
        {/* Gradiente para indicar scroll */}
        <div className="absolute right-0 top-0 bottom-1 w-6 bg-gradient-to-l from-[#1a1a2e] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};