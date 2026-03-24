import React from 'react';
import { DocsCard } from '../../components/ui/DocsCard';
import { SectionHeader } from '../../components/content/SectionHeader';
import { ContentBlock } from '../../components/content/ContentBlock';
import { VideoPlayer } from '../../components/content/VideoPlayer';

const features = [
  {
    title: 'Gestion des restaurants',
    items: [
      'Créer et modifier les informations du restaurant (nom, type de cuisine, notation)',
    ],
  },
  {
    title: 'Gestion des tables',
    items: [
      'Ajouter des tables avec leur capacité (nombre de couverts)',
      'Générer et télécharger les QR codes pour chaque table',
      'Imprimer les QR codes directement',
    ],
  },
  {
    title: 'Gestion des plats',
    items: [
      'Créer des plats avec titre, prix, image et catégorie (entrée, plat, dessert, boisson)',
      'Définir des restrictions âge pour certains produits',
    ],
  },
  {
    title: 'Gestion des menus (formules)',
    items: [
      'Créer des formules avec titre, description, prix et image',
      'Définir la composition (nombre entrées, plats, desserts, boissons)',
      'Activer ou désactiver des formules',
    ],
  },
  {
    title: 'Suivi des réservations',
    items: [
      'Visualiser toutes les réservations du restaurant',
      'Consulter le détail de chaque réservation (convives, table, date)',
    ],
  },
];

export const BackofficeSection: React.FC = () => {
  return (
    <DocsCard>
      <SectionHeader
        id="back-office"
        title="Espace Administration"
        subtitle="Gérez votre établissement depuis une interface dédiée"
        icon="Settings"
      />

      <ContentBlock className="mt-6">
        <p className="text-luminous-text-secondary italic border-l-4 border-luminous-gold pl-4">
          Espace Back Office permet aux gérants de restaurants de configurer
          leur établissement, gérer les tables, composer les menus et suivre les
          réservations.
        </p>
      </ContentBlock>

      <ContentBlock className="mt-6">
        <div className="bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg p-4">
          <h4 className="font-sans font-medium text-luxury-gold mb-2">
            Restaurants demo
          </h4>
          <p className="text-luminous-text-secondary text-sm">
            Pour les besoins de demonstration, deux restaurants demo sont
            pre-charges. Ils sont modifiables comme des restaurants normaux et
            affichent un badge &quot;Restaurant demo&quot;.
          </p>
        </div>
      </ContentBlock>

      <VideoPlayer
        src="/videos/backoffice-demo.mp4"
        title="Espace Administration"
        fallbackMessage="Démonstration de l'espace admin"
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

      <ContentBlock className="mt-8">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <h4 className="font-sans font-medium text-amber-400 mb-2">
            Note sur la gestion du temps
          </h4>
          <p className="text-luminous-text-secondary text-sm">
            La gestion des créneaux horaires de réservation (disponibilité des
            tables en temps réel, heure d'arrivée, durée de réservation) a été
            volontairement écartée du périmètre actuel en raison des contraintes
            de temps du projet et de la complexité d'implémentation associée.
            Cette fonctionnalité pourra être intégrée sans difficulté dans une
            version ultérieure, l'architecture actuelle étant conçue pour
            l'accueillir.
          </p>
        </div>
      </ContentBlock>
    </DocsCard>
  );
};
