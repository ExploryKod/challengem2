import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";

export interface ITableGateway {
    getTables(): Promise<OrderingDomainModel.Table[]>; 
}