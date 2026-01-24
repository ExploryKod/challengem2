export namespace DocsDomainModel {
  export type SectionId =
    | 'apercu'
    | 'commande-web'
    | 'commande-terminal'
    | 'commande-qr'
    | 'back-office'
    | 'app-cuisine';

  export interface Section {
    id: SectionId;
    title: string;
    icon: string; // nom icône lucide
  }

  export const SECTIONS: Section[] = [
    { id: 'apercu', title: 'Aperçu Général', icon: 'Utensils' },
    { id: 'commande-web', title: 'Commande en Ligne', icon: 'Globe' },
    { id: 'commande-terminal', title: 'Commande sur Borne', icon: 'Monitor' },
    { id: 'commande-qr', title: 'Commande QR Code', icon: 'QrCode' },
    { id: 'back-office', title: 'Back Office', icon: 'Settings' },
    { id: 'app-cuisine', title: 'Application Cuisine', icon: 'ChefHat' },
  ];
}
