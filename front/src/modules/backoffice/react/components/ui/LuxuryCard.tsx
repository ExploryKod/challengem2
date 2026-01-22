import React from 'react';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-luxury-bg-card rounded-xl p-6
        border border-luxury-gold-border
        ${hoverable ? 'cursor-pointer hover:border-luxury-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
