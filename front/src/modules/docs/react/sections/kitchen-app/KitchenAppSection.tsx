import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { StepList } from '../../components/content/StepList';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const steps = [
  {
    title: 'Réception des commandes',
    description:
      "Les nouvelles commandes apparaissent automatiquement à l'écran, triées par ordre d'arrivée.",
  },
  {
    title: 'Vue par service',
    description:
      'Chaque commande affiche le détail par catégorie : entrées, plats, desserts, boissons avec les quantités.',
  },
  {
    title: 'Marquage des services',
    description:
      "Lorsqu'un service est prêt, appuyez sur le bouton correspondant pour notifier le personnel de salle.",
  },
  {
    title: 'Historique',
    description:
      'Consultez les commandes terminées pour référence ou statistiques.',
  },
];

const features = [
  'Affichage temps réel (pull-to-refresh)',
  'Filtrage par type de plat',
  'Suivi du statut par service (entrées prêtes, plats prêts, etc.)',
  'Historique des commandes terminées',
];

export const KitchenAppSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="app-cuisine"
        title="Application Cuisine"
        subtitle="Suivez et gérez les commandes en temps réel depuis la cuisine"
        icon="ChefHat"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          L'application cuisine (Kitchen Display System) affiche les commandes
          actives en temps réel. L'équipe en cuisine peut suivre l'avancement et
          marquer chaque service comme prêt.
        </p>
      </ContentBlock>

      <VideoPlayer
        src="/videos/kitchen-app-demo.mp4"
        title="Application Cuisine"
        fallbackMessage="Démonstration de l'application cuisine"
      />

      <StepList steps={steps} />

      <div className="mt-8">
        <h3 className="font-sans font-medium text-luminous-text-primary mb-3">
          Fonctionnalités clés
        </h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-luminous-text-secondary"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-luminous-gold" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </DocsCard>
  );
};
