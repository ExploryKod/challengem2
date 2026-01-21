import { IParcoursGateway } from "@taotask/modules/welcome/core/gateway/parcours.gateway";

export class FailingParcoursGateway implements IParcoursGateway {

    async getParcoursList(): Promise<any> {
        throw new Error("Failed to fetch parcours");
    }
    
}