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
      'Parcourez notre selection de restaurants de luxe. Consultez les notes et le type de cuisine pour faire votre choix.',
  },
  {
    title: 'Apercu de la carte',
    description:
      'Decouvrez les plats proposes avant de vous engager. Entrees, plats, desserts et boissons sont presentes avec leurs prix.',
  },
  {
    title: 'Selectionner une table',
    description:
      'Choisissez une table adaptee au nombre de convives. La capacite de chaque table est indiquee.',
  },
  {
    title: 'Ajouter les convives',
    description:
      'Renseignez le nom de chaque personne. Designez un organisateur qui recevra le code de reservation.',
  },
  {
    title: 'Composer les repas',
    description:
      'Chaque convive selectionne ses plats par categorie : entree, plat principal, dessert et boisson.',
  },
  {
    title: 'Recapitulatif',
    description:
      'Verifiez ensemble de votre commande avant validation. Le detail par convive est affiche.',
  },
  {
    title: 'Confirmation',
    description:
      'Votre reservation est confirmee ! Un code unique vous est attribue pour le jour J.',
  },
];

const features = [
  'Selection multi-services par convive',
  'Verification age automatique pour certains plats',
  'Code de reservation unique',
];

export const WebOrderSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="commande-web"
        title="Commande en Ligne"
        subtitle="Reservez votre table et composez votre repas depuis chez vous"
        icon="Globe"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Taste Federation vous permet de reserver une table dans nos
          restaurants partenaires et de pre-commander vos repas en quelques
          clics. Suivez le parcours ci-dessous pour comprendre chaque etape.
        </p>
      </ContentBlock>

      <VideoPlayer
        title="Commande en Ligne"
        fallbackMessage="Demonstration de la reservation en ligne"
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
