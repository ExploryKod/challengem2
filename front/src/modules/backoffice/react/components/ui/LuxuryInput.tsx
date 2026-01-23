import React from 'react';

interface LuxuryInputProps {
  label: string;
  name: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  min?: number;
  max?: number;
  autoComplete?: string;
  defaultValue?: string | number;
}

export const LuxuryInput: React.FC<LuxuryInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  min,
  max,
  autoComplete,
  defaultValue,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-luxury-gold-muted mb-2 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-luxury-rose ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-luxury-bg-primary border
          text-luxury-text-primary placeholder-luxury-text-secondary
          focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold
          transition-all duration-200
          ${error ? 'border-luxury-rose' : 'border-luxury-gold-border'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-luxury-rose">{error}</p>
      )}
    </div>
  );
};
