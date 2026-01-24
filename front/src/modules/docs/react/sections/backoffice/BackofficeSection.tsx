import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const features = [
  {
    title: 'Gestion des restaurants',
    items: [
      'Creer et modifier les informations du restaurant (nom, type de cuisine, notation)',
      'Configurer les horaires et la capacite totale',
    ],
  },
  {
    title: 'Gestion des tables',
    items: [
      'Ajouter des tables avec leur capacite (nombre de couverts)',
      'Generer et telecharger les QR codes pour chaque table',
      'Imprimer les QR codes directement',
    ],
  },
  {
    title: 'Gestion des repas',
    items: [
      'Creer des plats avec titre, prix, image et categorie (entree, plat, dessert, boisson)',
      'Definir des restrictions age pour certains produits',
      'Organiser le menu par categorie',
    ],
  },
  {
    title: 'Suivi des reservations',
    items: [
      'Visualiser toutes les reservations par statut (en attente, installee, en preparation, terminee)',
      'Consulter le detail de chaque reservation',
    ],
  },
];

export const BackofficeSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="back-office"
        title="Espace Administration"
        subtitle="Gerez votre etablissement depuis une interface dediee"
        icon="Settings"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Espace Back Office permet aux gerants de restaurants de configurer
          leur etablissement, gerer les tables, composer les menus et suivre les
          reservations.
        </p>
      </ContentBlock>

      <VideoPlayer
        title="Espace Administration"
        fallbackMessage="Demonstration de espace admin"
      />

      <div className="mt-8 space-y-6">
        {features.map((feature, index) => (
          <div key={index}>
            <h3 className="font-sans font-medium text-luminous-text-primary mb-3">
              {feature.title}
            </h3>
            <ul className="space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-2 text-luminous-text-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-luminous-gold mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DocsCard>
  );
};
