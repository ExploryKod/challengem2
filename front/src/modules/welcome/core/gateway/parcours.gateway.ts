import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";

// En architecture hexagonale on appelle cette interface un port
// Ce port se place entre mon domain et l'infrastructure
// Après on doit créer un adapteur pour implémenter ce port
export interface IParcoursGateway {
    getParcoursList(): Promise<WelcomingDomainModel.ParcoursList>;
}