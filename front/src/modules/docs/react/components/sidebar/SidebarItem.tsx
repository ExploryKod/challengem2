import React from 'react';
import {
  Globe,
  Monitor,
  QrCode,
  Settings,
  ChefHat,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Monitor,
  QrCode,
  Settings,
  ChefHat,
};

interface SidebarItemProps {
  id: string;
  title: string;
  icon: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  title,
  icon,
  isActive,
  onClick,
}) => {
  const IconComponent = iconMap[icon] || Globe;

  return (
    <button
      onClick={() => onClick(id)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
        transition-all duration-200
        ${
          isActive
            ? 'bg-luminous-gold/10 text-luminous-gold border-l-4 border-luminous-gold'
            : 'text-luminous-text-secondary hover:bg-luminous-gold/5 hover:text-luminous-text-primary border-l-4 border-transparent'
        }
      `}
    >
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <span className="font-sans text-sm">{title}</span>
    </button>
  );
};
