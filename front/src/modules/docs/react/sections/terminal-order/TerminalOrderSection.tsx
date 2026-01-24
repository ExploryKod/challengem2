import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { StepList } from '../../components/content/StepList';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const steps = [
  {
    title: 'Accueil sur la borne',
    description:
      'Ecran accueil vous invite a scanner votre code de reservation ou a demarrer une nouvelle commande.',
  },
  {
    title: 'Identification',
    description:
      'Entrez votre code de reservation pour retrouver votre table et vos convives deja enregistres.',
  },
  {
    title: 'Selection des plats',
    description:
      'Parcourez le menu par categorie et ajoutez les plats souhaites pour chaque convive.',
  },
  {
    title: 'Validation',
    description:
      'Confirmez votre selection. La commande est transmise directement en cuisine.',
  },
];

const features = [
  'Interface tactile intuitive',
  'Synchronisation avec les reservations en ligne',
  'Envoi direct en cuisine',
];

export const TerminalOrderSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="commande-terminal"
        title="Commande sur Borne"
        subtitle="Passez commande directement au restaurant via notre borne interactive"
        icon="Monitor"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          A votre arrivee au restaurant, une borne tactile vous permet de
          finaliser votre commande. Ideal si vous navez pas pre-commande en
          ligne ou souhaitez modifier vos choix.
        </p>
      </ContentBlock>

      <VideoPlayer
        title="Commande sur Borne"
        fallbackMessage="Demonstration de la commande sur borne"
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
