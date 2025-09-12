import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export type RippleButtonProps = {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * RippleButton Component
 * 
 * Material Design inspired button with ripple effect animation.
 * Provides visual feedback on user interaction.
 */
export const RippleButton: React.FC<RippleButtonProps> = ({ 
  children, 
  onClick, 
  className, 
  ...props 
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
    
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={cn("relative overflow-hidden rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95", className)}
      onClick={addRipple}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms'
          }}
        />
      ))}
    </button>
  );
};