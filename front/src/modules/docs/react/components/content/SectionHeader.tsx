import React from 'react';
import {
  Globe,
  Monitor,
  QrCode,
  Settings,
  ChefHat,
  Utensils,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Globe,
  Monitor,
  QrCode,
  Settings,
  ChefHat,
  Utensils,
};

interface SectionHeaderProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  id,
  title,
  subtitle,
  icon,
}) => {
  const IconComponent = iconMap[icon] || Globe;

  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-luminous-gold/10 flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-luminous-gold" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-luminous-text-primary">
            {title}
          </h2>
          <p className="text-luminous-text-secondary font-sans">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
