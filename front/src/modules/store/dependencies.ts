import { IIDProvider } from '@taotask/modules/core/id-provider';
import { IParcoursGateway } from '@taotask/modules/welcome/core/gateway/parcours.gateway';
import { ITableGateway } from '@taotask/modules/order/core/gateway/table.gateway';

export type Dependencies = {
    idProvider?: IIDProvider;
    parcoursGateway?: IParcoursGateway;
    tableGateway?: ITableGateway;
};