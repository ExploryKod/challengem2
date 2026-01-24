import React from 'react';
import { DocsDomainModel } from '@taotask/modules/docs/core/model/docs.domain-model';
import { SidebarItem } from './SidebarItem';

interface DocsSidebarProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const DocsSidebar: React.FC<DocsSidebarProps> = ({
  activeSection,
  onSectionClick,
}) => {
  const handleClick = (sectionId: string) => {
    onSectionClick?.(sectionId);
  };

  return (
    <nav className="p-6">
      <h1 className="font-display text-xl text-luminous-text-primary mb-6">
        Documentation
      </h1>
      <div className="space-y-1">
        {DocsDomainModel.SECTIONS.map((section) => (
          <SidebarItem
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            isActive={activeSection === section.id}
            onClick={handleClick}
          />
        ))}
      </div>
    </nav>
  );
};
