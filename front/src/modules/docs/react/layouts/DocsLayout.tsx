'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface DocsLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export const DocsLayout: React.FC<DocsLayoutProps> = ({
  sidebar,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-luminous-bg-primary">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-luminous-bg-card border-b border-luminous-gold-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-display text-lg text-luminous-text-primary">
            Documentation
          </h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-luminous-text-primary hover:text-luminous-gold transition-colors"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64
          bg-luminous-bg-card border-r border-luminous-gold-border
          transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div onClick={() => setIsMobileMenuOpen(false)}>{sidebar}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 w-64 h-screen overflow-y-auto border-r border-luminous-gold-border bg-luminous-bg-card">
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12">{children}</div>
      </main>
    </div>
  );
};
