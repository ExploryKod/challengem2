import { WelcomingDomainModel } from "@taotask/modules/welcome/core/model/welcoming.domain-model";
import { Dependencies } from "@taotask/modules/store/dependencies";

export const getParcoursList = async (dependencies: Dependencies): Promise<WelcomingDomainModel.ParcoursList> => {
    if (!dependencies.parcoursGateway) {
        return {
            parcours: [],
            parcoursId: ""
        };
    }
    return await dependencies.parcoursGateway.getParcoursList();
};