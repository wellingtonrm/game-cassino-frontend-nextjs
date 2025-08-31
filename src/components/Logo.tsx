'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 ${className}`}>
      <Image 
        src="/icon-logo.svg" 
        alt="Boominas Logo" 
        width={parseInt(iconSizes[size].split(' ')[0].replace('w-', '')) * 4}
        height={parseInt(iconSizes[size].split(' ')[0].replace('w-', '')) * 4}
        className={`${iconSizes[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;