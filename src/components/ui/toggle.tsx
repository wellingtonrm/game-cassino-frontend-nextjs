import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

/**
 * Toggle Component - Android Material Design style
 * 
 * Custom toggle component following Android design principles
 * with smooth animations and proper accessibility.
 */
export const Toggle: React.FC<ToggleProps> = ({
  pressed = false,
  onPressedChange,
  disabled = false,
  children,
  className,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fdbf5c]',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95 transform transition-transform'
  ];

  const variants = {
    default: pressed 
      ? 'bg-[#fdbf5c] text-[#121214] shadow-lg shadow-[#fdbf5c]/25' 
      : 'bg-[#1A2040] text-gray-300 hover:bg-[#121214] hover:text-white',
    outline: pressed
      ? 'border-2 border-[#fdbf5c] bg-[#fdbf5c]/10 text-[#fdbf5c]'
      : 'border-2 border-[#1A2040] bg-transparent text-gray-400 hover:border-gray-500 hover:text-gray-300',
    ghost: pressed
      ? 'bg-[#fdbf5c]/20 text-[#fdbf5c]'
      : 'bg-transparent text-gray-400 hover:bg-[#1A2040] hover:text-gray-300'
  };

  const sizes = {
    default: 'h-9 px-3 text-sm',
    sm: 'h-8 px-2 text-xs',
    lg: 'h-10 px-4 text-base'
  };

  return (
    <button
      type="button"
      role="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => onPressedChange?.(!pressed)}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Grupo de toggles para seleção exclusiva (como radio buttons)
interface ToggleGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  onValueChange,
  children,
  className,
  disabled = false
}) => {
  return (
    <div 
      className={cn('flex bg-[#1A2040] rounded-lg p-1 gap-1', className)}
      role="group"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...(child.props as any),
            disabled: disabled || (child.props as any).disabled,
            pressed: (child.props as any).value === value,
            onPressedChange: () => onValueChange?.((child.props as any).value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface ToggleGroupItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  pressed?: boolean;
  onPressedChange?: () => void;
}

export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  value,
  children,
  className,
  disabled = false,
  pressed = false,
  onPressedChange,
  ...props
}) => {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
      variant="ghost"
      className={cn(
        'flex-1 data-[state=on]:bg-[#fdbf5c] data-[state=on]:text-[#121214]',
        pressed && 'bg-[#fdbf5c] text-[#121214]',
        className
      )}
      {...props}
    >
      {children}
    </Toggle>
  );
};