'use client';
import React, { useEffect } from 'react';

interface LuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const LuxuryModal: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-luxury-bg-secondary rounded-xl border border-luxury-gold-border shadow-2xl">
        <div className="px-6 py-4 border-b border-luxury-gold-border">
          <h2 className="text-xl font-serif text-luxury-text-primary">{title}</h2>
          <div className="mt-2 h-0.5 w-16 bg-luxury-gold" />
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
