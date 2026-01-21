// Approche de chicago (TDD) > on se créer un stub pour nos tests
import { IParcoursGateway } from "@taotask/modules/welcome/core/gateway/parcours.gateway";
import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";

// 1. On créer un stub pour nos tests et ensuite on va donc changer nos test dans fetch table usecase test
export class StubParcoursGateway implements IParcoursGateway {
    constructor(private data: WelcomingDomainModel.ParcoursList){}

    async getParcoursList(): Promise<WelcomingDomainModel.ParcoursList> {
        return this.data;
    }
    
}