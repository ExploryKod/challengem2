import { IParcoursGateway } from "@taotask/modules/welcome/core/gateway/parcours.gateway";
import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";

// On a pas de bdd donc on crée de la fake data via in memory (notre gateway est nécessaire pour que ça fonctionne)
// Données externes >> promise >> async/await
export class InMemoryParcoursGateway implements IParcoursGateway {
    async getParcoursList(): Promise<WelcomingDomainModel.ParcoursList> {
        return {
            parcours: [
                {
                    id: "1",
                    text: "Réservez votre table",
                    link: "/parcours/reservations",
                    image: {
                        url: "/images/parcours-reservations.jpg",
                        alt: "Parcours réservations",
                        title: "Parcours Réservations"
                    }
                },
                {
                    id: "2",
                    text: "Découvrir nos restaurants",
                    link: "/parcours/restaurants",
                    image: {
                        url: "/images/parcours-restaurants.jpg",
                        alt: "Parcours restaurants",
                        title: "Parcours Restaurants"
                    }
                },
                {
                    id: "3",
                    text: "Consultez les réservations",
                    link: "/parcours/consultations",
                    image: {
                        url: "/images/parcours-consultations.jpg",
                        alt: "Parcours consultations",
                        title: "Parcours Consultations"
                    }
                }
            ],
            parcoursId: ""
        };
    }
}