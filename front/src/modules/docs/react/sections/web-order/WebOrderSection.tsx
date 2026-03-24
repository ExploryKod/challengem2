import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { StepList } from '../../components/content/StepList';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const steps = [
  {
    title: 'Choisir un restaurant',
    description:
      'Parcourez notre sélection de restaurants de luxe. Consultez les notes et le type de cuisine pour faire votre choix.',
  },
  {
    title: 'Aperçu de la carte',
    description:
      'Découvrez les plats proposés avant de vous engager. Entrées, plats, desserts et boissons sont présentés avec leurs prix.',
  },
  {
    title: 'Sélectionner une table',
    description:
      'Choisissez une table adaptée au nombre de convives. La capacité de chaque table est indiquée.',
  },
  {
    title: 'Ajouter les convives',
    description:
      'Renseignez le nom de chaque personne. Désignez un organisateur qui recevra le code de réservation.',
  },
  {
    title: 'Composer les repas',
    description:
      'Chaque convive peut choisir une formule (menu) ou sélectionner ses plats individuellement par catégorie.',
  },
  {
    title: 'Récapitulatif',
    description:
      "Vérifiez l'ensemble de votre commande avant validation. Le détail par convive est affiché.",
  },
  {
    title: 'Confirmation',
    description:
      'Votre réservation est confirmée ! Un code unique vous est attribué pour le jour J.',
  },
];

const features = [
  'Choix entre formules et sélection à la carte',
  'Sélection multi-services par convive',
  'Vérification âge automatique pour certains plats',
  'Code de réservation unique',
];

export const WebOrderSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="commande-web"
        title="Commande en Ligne"
        subtitle="Réservez votre table et composez votre repas depuis chez vous"
        icon="Globe"
      />

      <ContentBlock className="mt-6 mb-2">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Taste Federation vous permet de réserver une table dans nos
          restaurants partenaires et de pré-commander vos repas en quelques
          clics. Suivez le parcours ci-dessous pour comprendre chaque étape.
        </p>
      </ContentBlock>

      <VideoPlayer
        src="/videos/web-order-demo.mp4"
        title="Commande en Ligne"
        fallbackMessage="Démonstration de la réservation en ligne"
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
