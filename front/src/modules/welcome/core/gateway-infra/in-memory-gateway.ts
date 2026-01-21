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
                    text: "Réservez une table",
                    link: "/order",
                    image: {
                        url: "/booking/parcours-order.jpg",
                        alt: "Parcours order",
                        title: "Réserver une table"
                    }
                },
                {
                    id: "2",
                    text: "Nos restaurants",
                    link: "/restaurants",
                    image: {
                        url: "/booking/parcours-restaurants.jpg",
                        alt: "Parcours restaurants",
                        title: "Parcours Restaurants"
                    }
                },
                {
                    id: "3",
                    text: "Réservations",
                    link: "/consultations",
                    image: {
                        url: "/booking/parcours-consultations.jpg",
                        alt: "Parcours consultations",
                        title: "Parcours Consultations"
                    }
                }
            ],
            parcoursId: ""
        };
    }
}