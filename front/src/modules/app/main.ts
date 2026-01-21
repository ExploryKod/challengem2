import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore, AppState } from "@taotask/modules/store/store";
import { InMemoryParcoursGateway } from "../welcome/core/gateway-infra/in-memory-gateway";
import { GatewayFactory } from "@taotask/modules/order/core/model/gateway.factory";

export class App {
  public dependencies: Dependencies;
  public store: AppStore;

  constructor() {
    const tempDependencies = {
      idProvider: new SystemIdProvider(),
      parcoursGateway: new InMemoryParcoursGateway(),
    };
    
    this.store = createStore({ dependencies: tempDependencies });
    
    const getState = (): AppState => this.store.getState();
    
    this.dependencies = {
      ...tempDependencies,
      tableGateway: GatewayFactory.createTableGateway(getState),
      mealGateway: GatewayFactory.createMealGateway(getState),
      reservationGateway: GatewayFactory.createReservationGateway(getState),
      restaurantGateway: GatewayFactory.createRestaurantGateway(),
    };
  }
}

export const app = new App();