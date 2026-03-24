import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import {
  Globe,
  Monitor,
  QrCode,
  Settings,
  ChefHat,
  Utensils,
  ArrowRight,
} from 'lucide-react';

const modules = [
  {
    icon: Globe,
    title: 'Commande en Ligne',
    description: 'Réservation et pré-commande depuis le site web',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Monitor,
    title: 'Borne Interactive',
    description: 'Commande autonome sur place',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: QrCode,
    title: 'QR Code Table',
    description: 'Scan et commande depuis la table',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Settings,
    title: 'Back Office',
    description: 'Gestion complète du restaurant',
    color: 'text-luminous-gold',
    bgColor: 'bg-luminous-gold/10',
  },
  {
    icon: ChefHat,
    title: 'App Cuisine',
    description: 'Suivi des commandes en cuisine',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
];

export const OverviewSection: React.FC = () => {
  return (
    <DocsCard>
      <div id="apercu" className="scroll-mt-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-luminous-gold/10 flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-luminous-gold" />
          </div>
          <h2 className="font-display text-3xl text-luminous-text-primary mb-3">
            Smart Cafe
          </h2>
          <p className="text-luminous-text-secondary text-lg max-w-2xl mx-auto">
            Solution complète de gestion de restaurant avec réservation de table
            et pré-commande de repas
          </p>
        </div>

        {/* Concept */}
        <div className="bg-luminous-surface-secondary rounded-xl p-6 mb-10">
          <h3 className="font-sans font-medium text-luminous-text-primary mb-4 text-center">
            Le concept en quelques mots
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">1</div>
              <p className="text-luminous-text-primary font-medium">
                Choisir ses convives
              </p>
              <p className="text-luminous-text-secondary text-sm">
                Nombre de personnes et leurs profils
              </p>
            </div>
            <div className="flex items-center justify-center md:hidden">
              <ArrowRight className="w-5 h-5 text-luminous-gold rotate-90" />
            </div>
            <div className="hidden md:flex items-center justify-center absolute-indicator">
              <ArrowRight className="w-5 h-5 text-luminous-gold" />
            </div>
            <div>
              <div className="text-3xl mb-2">2</div>
              <p className="text-luminous-text-primary font-medium">
                Réserver une table
              </p>
              <p className="text-luminous-text-secondary text-sm">
                Attribution automatique selon la capacité
              </p>
            </div>
            <div className="flex items-center justify-center md:hidden">
              <ArrowRight className="w-5 h-5 text-luminous-gold rotate-90" />
            </div>
            <div className="hidden md:flex items-center justify-center absolute-indicator">
              <ArrowRight className="w-5 h-5 text-luminous-gold" />
            </div>
            <div>
              <div className="text-3xl mb-2">3</div>
              <p className="text-luminous-text-primary font-medium">
                Pré-commander ses repas
              </p>
              <p className="text-luminous-text-secondary text-sm">
                Entrées, plats, desserts, boissons
              </p>
            </div>
          </div>
        </div>

        <div className="bg-luminous-gold/10 border border-luminous-gold/30 rounded-xl p-5 mb-10 text-center">
          <h3 className="font-sans font-medium text-luminous-gold mb-2">
            Mode demo (portfolio)
          </h3>
          <p className="text-luminous-text-secondary text-sm">
            Deux restaurants d&apos;exemple sont toujours disponibles pour
            presenter l&apos;application, meme sans API connectee. Ils sont
            identifies par un badge &quot;Restaurant demo&quot;.
          </p>
        </div>

        {/* Modules */}
        <div>
          <h3 className="font-sans font-medium text-luminous-text-primary mb-6 text-center">
            5 modules interconnectés
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  className="bg-luminous-surface-secondary rounded-lg p-4 text-center hover:bg-luminous-surface-secondary/80 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-full ${module.bgColor} flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <h4 className="font-sans font-medium text-luminous-text-primary text-sm mb-1">
                    {module.title}
                  </h4>
                  <p className="text-luminous-text-secondary text-xs">
                    {module.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <p className="text-center text-luminous-text-secondary mt-8 text-sm italic">
          Découvrez chaque module en détail dans les sections ci-dessous
        </p>
      </div>
    </DocsCard>
  );
};
