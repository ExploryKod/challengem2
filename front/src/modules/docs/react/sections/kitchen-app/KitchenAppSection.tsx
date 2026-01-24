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

      {/* Expo Go Installation Section */}
      <div className="mt-10 p-6 bg-luminous-bg-secondary rounded-lg border border-luminous-gold/20">
        <h3 className="font-sans font-semibold text-luminous-text-primary text-lg mb-4 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          Tester l'application mobile
        </h3>

        <p className="text-luminous-text-secondary mb-6">
          L'application cuisine est disponible sur mobile via <strong>Expo Go</strong>.
          Suivez les étapes ci-dessous pour la tester sur votre téléphone.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luminous-gold text-luminous-bg-primary flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-medium text-luminous-text-primary">Installer Expo Go</h4>
              <p className="text-luminous-text-secondary text-sm mt-1">
                Téléchargez l'application <strong>Expo Go</strong> depuis :
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href="https://play.google.com/store/apps/details?id=host.exp.exponent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luminous-gold hover:underline text-sm"
                >
                  → Google Play (Android)
                </a>
                <a
                  href="https://apps.apple.com/app/expo-go/id982107779"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-luminous-gold hover:underline text-sm"
                >
                  → App Store (iOS)
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luminous-gold text-luminous-bg-primary flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-medium text-luminous-text-primary">Scanner le QR Code</h4>
              <p className="text-luminous-text-secondary text-sm mt-1">
                <strong>Android :</strong> Ouvrez Expo Go et scannez directement le QR code.<br />
                <strong>iOS :</strong> Ouvrez l'appareil photo et scannez le QR code, puis appuyez sur la notification pour ouvrir dans Expo Go.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luminous-gold text-luminous-bg-primary flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-medium text-luminous-text-primary">Utiliser l'application</h4>
              <p className="text-luminous-text-secondary text-sm mt-1">
                Sélectionnez le restaurant "Papilles des Suds" pour accéder à l'écran cuisine et voir les commandes en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="mt-8 flex flex-col items-center">
          <p className="text-luminous-text-secondary text-sm mb-4">
            Scannez ce QR code avec Expo Go :
          </p>
          <div className="bg-white p-4 rounded-lg">
            <img
              src="/images/expo-qr-code.png"
              alt="QR Code pour l'application cuisine Expo Go"
              className="w-48 h-48"
            />
          </div>
          <p className="text-luminous-text-secondary text-xs mt-3 text-center">
            SmartCafe Kitchen - Application Cuisine
          </p>
        </div>
      </div>
    </DocsCard>
  );
};
