import { SystemIdProvider } from "@taotask/modules/core/system.id-provider";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { AppStore, createStore, AppState } from "@taotask/modules/store/store";
import { GatewayFactory } from "@taotask/modules/order/core/model/gateway.factory";
import { BackofficeGatewayFactory } from "@taotask/modules/backoffice/core/model/gateway.factory";
import { DemoRestaurantsStore } from "@taotask/modules/shared/demo/demo-restaurants.store";
import { DemoTablesStore } from "@taotask/modules/shared/demo/demo-tables.store";
import { DemoMealsStore } from "@taotask/modules/shared/demo/demo-meals.store";
export class App {
  public dependencies: Dependencies;
  public store: AppStore;

  constructor() {

    const dependenciesRef: Dependencies = {
      idProvider: new SystemIdProvider(),
    };
    

    this.store = createStore({ dependencies: dependenciesRef });
    
    const getState = (): AppState => this.store.getState();
   
    const demoRestaurantsStore = new DemoRestaurantsStore();
    const demoTablesStore = new DemoTablesStore();
    const demoMealsStore = new DemoMealsStore();

    dependenciesRef.tableGateway = GatewayFactory.createTableGateway(getState, demoTablesStore);
    dependenciesRef.mealGateway = GatewayFactory.createMealGateway(getState, demoMealsStore);
    dependenciesRef.menuGateway = GatewayFactory.createMenuGateway();
    dependenciesRef.reservationGateway = GatewayFactory.createReservationGateway(getState);
    dependenciesRef.restaurantGateway = GatewayFactory.createRestaurantGateway(demoRestaurantsStore);

    // Terminal gateway
    dependenciesRef.terminalReservationGateway = GatewayFactory.createTerminalReservationGateway();

    // Backoffice gateways
    dependenciesRef.restaurantManagementGateway = BackofficeGatewayFactory.createRestaurantManagementGateway(
      demoRestaurantsStore,
    );
    dependenciesRef.tableManagementGateway = BackofficeGatewayFactory.createTableManagementGateway(
      demoTablesStore,
    );
    dependenciesRef.mealManagementGateway = BackofficeGatewayFactory.createMealManagementGateway(
      demoMealsStore,
    );
    dependenciesRef.reservationManagementGateway = BackofficeGatewayFactory.createReservationManagementGateway();

    this.dependencies = dependenciesRef;
  }
}

export const app = new App();