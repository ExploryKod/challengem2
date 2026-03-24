import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { StepList } from '../../components/content/StepList';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const steps = [
  {
    title: 'Scanner le QR code',
    description:
      'Utilisez l\'appareil photo de votre téléphone pour scanner le code présent sur la table.',
  },
  {
    title: 'Détection automatique',
    description:
      'Le système identifie votre table et vérifie si une commande est déjà en cours.',
  },
  {
    title: 'Nouvelle commande ou ajout',
    description:
      'Si une commande existe, vous pouvez y ajouter des plats. Sinon, démarrez une nouvelle commande.',
  },
  {
    title: 'Nombre de convives',
    description:
      'Indiquez combien de personnes sont a table (limite a la capacite de la table).',
  },
  {
    title: 'Sélection et envoi',
    description:
      'Composez vos repas et envoyez la commande en cuisine d\'un simple tap.',
  },
];

const features = [
  'Aucune application à installer',
  'Détection des commandes existantes',
  'Plusieurs convives peuvent commander simultanément',
];

export const QrOrderSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="commande-qr"
        title="Commande par QR Code"
        subtitle="Scannez le code sur votre table et commandez depuis votre téléphone"
        icon="QrCode"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Chaque table dispose d\'un QR code unique. Scannez-le avec votre
          smartphone pour accéder directement à l\'interface de commande, sans
          télécharger d\'application.
        </p>
      </ContentBlock>

      <VideoPlayer
        src="/videos/qr-order-demo.mp4"
        title="Commande par QR Code"
        fallbackMessage="Démonstration de la commande par QR"
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
