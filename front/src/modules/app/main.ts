import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore, AppState } from "@taotask/modules/store/store";
import { InMemoryParcoursGateway } from "../welcome/core/gateway-infra/in-memory-gateway";
import { GatewayFactory } from "@taotask/modules/order/core/model/gateway.factory";

export class App {
  public dependencies: Dependencies;
  public store: AppStore;

  constructor() {
    // Créer une référence mutable pour les dependencies
    const dependenciesRef: Dependencies = {
      idProvider: new SystemIdProvider(),
      parcoursGateway: new InMemoryParcoursGateway(),
    };
    
    // Créer le store avec la référence mutable
    this.store = createStore({ dependencies: dependenciesRef });
    
    const getState = (): AppState => this.store.getState();
    
    // Mettre à jour la référence avec les vrais gateways
    dependenciesRef.tableGateway = GatewayFactory.createTableGateway(getState);
    dependenciesRef.mealGateway = GatewayFactory.createMealGateway(getState);
    dependenciesRef.reservationGateway = GatewayFactory.createReservationGateway(getState);
    dependenciesRef.restaurantGateway = GatewayFactory.createRestaurantGateway();
    
    this.dependencies = dependenciesRef;
  }
}

export const app = new App();