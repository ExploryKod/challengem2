import { IIDProvider } from '@taotask/modules/core/id-provider';
import { IParcoursGateway } from '@taotask/modules/welcome/core/gateway/parcours.gateway';

export type Dependencies = {
    idProvider?: IIDProvider;
    parcoursGateway?: IParcoursGateway;
};
