'use client';
import React, { useEffect, useRef } from 'react';

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = 'luxury-modal-title';

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      if (e.shiftKey && activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
      previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    }

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'unset';
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-luxury-bg-secondary rounded-xl border border-luxury-gold-border shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={modalRef}
      >
        <div className="px-6 py-4 border-b border-luxury-gold-border">
          <h2 id={titleId} className="text-xl font-serif text-luxury-text-primary">{title}</h2>
          <div className="mt-2 h-0.5 w-16 bg-luxury-gold" />
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-luxury-text-secondary hover:text-luxury-gold transition-colors"
          aria-label="Fermer"
          ref={closeButtonRef}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
