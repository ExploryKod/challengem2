import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore, AppState } from "@taotask/modules/store/store";
import { GatewayFactory } from "@taotask/modules/order/core/model/gateway.factory";
import { BackofficeGatewayFactory } from "@taotask/modules/backoffice/core/model/gateway.factory";
export class App {
  public dependencies: Dependencies;
  public store: AppStore;

  constructor() {

    const dependenciesRef: Dependencies = {
      idProvider: new SystemIdProvider(),
    };
    

    this.store = createStore({ dependencies: dependenciesRef });
    
    const getState = (): AppState => this.store.getState();
   
    dependenciesRef.tableGateway = GatewayFactory.createTableGateway(getState);
    dependenciesRef.mealGateway = GatewayFactory.createMealGateway(getState);
    dependenciesRef.reservationGateway = GatewayFactory.createReservationGateway(getState);
    dependenciesRef.restaurantGateway = GatewayFactory.createRestaurantGateway();

    // Backoffice gateways
    dependenciesRef.restaurantManagementGateway = BackofficeGatewayFactory.createRestaurantManagementGateway();
    dependenciesRef.tableManagementGateway = BackofficeGatewayFactory.createTableManagementGateway();
    dependenciesRef.mealManagementGateway = BackofficeGatewayFactory.createMealManagementGateway();
    dependenciesRef.reservationManagementGateway = BackofficeGatewayFactory.createReservationManagementGateway();

    this.dependencies = dependenciesRef;
  }
}

export const app = new App();