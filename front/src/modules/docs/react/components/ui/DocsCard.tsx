import React from 'react';

interface DocsCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DocsCard: React.FC<DocsCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-luminous-bg-card rounded-xl p-6
        border border-luminous-gold-border
        shadow-[0_4px_20px_rgba(201,162,39,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
