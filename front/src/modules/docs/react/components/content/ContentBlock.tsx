import React from 'react';

interface ContentBlockProps {
  children: React.ReactNode;
  className?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`text-luminous-text-primary font-sans leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
};
