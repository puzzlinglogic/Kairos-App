import React from 'react';

interface CardProps {
  variant?: 'default' | 'glass' | 'pattern';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = ''
}) => {
  const baseClass = variant === 'glass' ? 'card-glass' :
                    variant === 'pattern' ? 'pattern-card' :
                    'card';

  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};
