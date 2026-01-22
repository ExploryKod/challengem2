import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface LuxurySelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string | null;
  required?: boolean;
  placeholder?: string;
}

export const LuxurySelect: React.FC<LuxurySelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-lg
          bg-luxury-bg-primary border
          text-luxury-text-primary
          focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold
          transition-all duration-200
          ${error ? 'border-luxury-rose' : 'border-luxury-gold-border'}
        `}
      >
        {placeholder && (
          <option value="" className="text-luxury-text-secondary">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-luxury-rose">{error}</p>
      )}
    </div>
  );
};
