import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { StepList } from '../../components/content/StepList';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const steps = [
  {
    title: 'Reception des commandes',
    description:
      'Les nouvelles commandes apparaissent automatiquement a ecran, triees par ordre arrivee.',
  },
  {
    title: 'Vue par service',
    description:
      'Chaque commande affiche le detail par categorie : entrees, plats, desserts, boissons avec les quantites.',
  },
  {
    title: 'Marquage des services',
    description:
      'Lorsqu un service est pret, appuyez sur le bouton correspondant pour notifier le personnel de salle.',
  },
  {
    title: 'Historique',
    description:
      'Consultez les commandes terminees pour reference ou statistiques.',
  },
];

const features = [
  'Affichage temps reel (pull-to-refresh)',
  'Filtrage par type de plat',
  'Suivi du statut par service (entrees pretes, plats prets, etc.)',
  'Historique des 20 dernieres commandes',
];

export const KitchenAppSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="app-cuisine"
        title="Application Cuisine"
        subtitle="Suivez et gerez les commandes en temps reel depuis la cuisine"
        icon="ChefHat"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Application cuisine (Kitchen Display System) affiche les commandes
          actives en temps reel. Equipe en cuisine peut suivre avancement et
          marquer chaque service comme pret.
        </p>
      </ContentBlock>

      <VideoPlayer
        title="Application Cuisine"
        fallbackMessage="Demonstration de application cuisine"
      />

      <StepList steps={steps} />

      <div className="mt-8">
        <h3 className="font-sans font-medium text-luminous-text-primary mb-3">
          Fonctionnalites cles
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
