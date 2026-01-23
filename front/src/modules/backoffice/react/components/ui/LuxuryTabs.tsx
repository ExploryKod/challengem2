'use client';
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface LuxuryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const LuxuryTabs: React.FC<LuxuryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-luxury-gold-border">
      <nav className="flex gap-8" aria-label="Tabs" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`
                relative pb-4 px-1 text-sm font-medium uppercase tracking-wider
                transition-colors duration-200
                ${isActive
                  ? 'text-luxury-gold'
                  : 'text-luxury-text-secondary hover:text-luxury-text-primary'
                }
              `}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
