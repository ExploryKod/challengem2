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
      "L'écran d'accueil vous propose de saisir votre code de réservation ou de démarrer une nouvelle commande sans réservation.",
  },
  {
    title: 'Identification',
    description:
      'Entrez votre code de réservation pour retrouver votre table et vos convives déjà enregistrés.',
  },
  {
    title: 'Sélection des plats',
    description:
      'Parcourez le menu par catégorie et ajoutez les plats souhaités pour chaque convive.',
  },
  {
    title: 'Validation',
    description:
      'Confirmez votre sélection. La commande est transmise directement en cuisine.',
  },
];

const features = [
  'Interface tactile intuitive',
  'Synchronisation avec les réservations en ligne',
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

      <ContentBlock className="mt-6 mb-2">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          À votre arrivée au restaurant, une borne tactile vous permet de
          finaliser votre commande. Idéal si vous n'avez pas pré-commandé en
          ligne ou souhaitez modifier vos choix, mais <strong>surtout</strong> pour lancer la préparation de votre commande en cuisine vous-même.
        </p>
      </ContentBlock>

      <VideoPlayer
        src="/videos/terminal-order-demo.mp4"
        title="Commande sur Borne"
        fallbackMessage="Démonstration de la commande sur borne"
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
