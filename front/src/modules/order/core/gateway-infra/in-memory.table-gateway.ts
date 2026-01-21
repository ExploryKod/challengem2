import { ITableGateway } from "@taotask/modules/order/core/gateway/table.gateway";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { TableFactory } from "@taotask/modules/order/core/model/table.factory";

export class InMemoryTableGateway implements ITableGateway {
    async getTables(): Promise<OrderingDomainModel.Table[]> {
        return [
            TableFactory.create({
                id : "1",
                title: "Prés de la fenêtre",
                capacity: 4
            }),
            TableFactory.create({
                id : "2",
                title: "Prés de la fenêtre",
                capacity: 4
            }),
            TableFactory.create({
                id : "3",
                title: "Au centre",
                capacity: 2
            }),
            TableFactory.create({
                id : "4",
                title: "Prés de la porte",
                capacity: 6
            }),
            TableFactory.create({
                id : "5",
                title: "A l'entrée",
                capacity: 10
            }),
            TableFactory.create({
                id : "6",
                title: "Prés du bar",
                capacity: 8
            })
        ]
        
    }
}