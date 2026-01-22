import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-luxury-gold text-luxury-bg-primary hover:bg-luxury-gold/90 focus:ring-luxury-gold/50',
  secondary: 'bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 focus:ring-luxury-gold/30',
  destructive: 'bg-luxury-rose text-luxury-text-primary hover:bg-luxury-rose-hover focus:ring-luxury-rose/50',
};

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg font-medium uppercase tracking-wider text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-luxury-bg-primary
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
