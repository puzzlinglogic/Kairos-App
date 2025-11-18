import React from 'react';

interface FloatingShapeProps {
  className?: string;
  animation?: 'slow' | 'medium';
  size?: number;
}

export const FloatingShape: React.FC<FloatingShapeProps> = ({
  className = '',
  animation = 'slow',
  size = 300
}) => {
  const animationClass = animation === 'slow' ? 'animate-float-slow' : 'animate-float-medium';

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br from-kairos-pink/20 to-kairos-purple/10 blur-3xl ${animationClass} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
