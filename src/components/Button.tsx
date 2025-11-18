import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' :
                    variant === 'secondary' ? 'btn-secondary' :
                    'btn-ghost';

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
