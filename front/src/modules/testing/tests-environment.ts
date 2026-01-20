import { AppState, createStore } from "@taotask/modules/store/store";
import { Dependencies } from "@taotask/modules/store/dependencies";
import { StubTableGateway } from "@taotask/modules/order/core/testing/stub.table-gateway";
import { StubMealGateway } from "@taotask/modules/order/core/testing/stub.meal-gateway";
import { StubIdProvider } from "@taotask/modules/core/stub.id-provider";
import {MockReservationGateway} from "@taotask/modules/order/core/testing/mock.reservationGateway";

/**
 * Create testing dependencies with provided defaults
 * @param dependencies
 * @returns
 */
const createDependencies = (
  dependencies?: Partial<Dependencies>
): Dependencies => ({
  idProvider : new StubIdProvider(),
  tableGateway: new StubTableGateway(),
  mealGateway: new StubMealGateway(),
  reservationGateway: new MockReservationGateway(),
  ...dependencies,
});

/**
 * Creates store initialized with a partial state
 * @param config
 * @returns
 */
export const createTestStore = (config?: {
  initialState?: Partial<AppState>;
  dependencies?: any;
}) => {
  const initialStore = createStore({
    dependencies: createDependencies(config?.dependencies),
  });

  const initialState = {
    ...initialStore.getState(),
    ...config?.initialState,
  };

  const store = createStore({
    initialState,
    dependencies: createDependencies(config?.dependencies),
  });

  return store;
};

/**
 * Useful for testing selectors without setting redux up
 * @param partialState
 * @returns
 */
export const createTestState = (partialState?: Partial<AppState>) => {
  const store = createStore({
    dependencies: createDependencies(),
  });

  const storeInitialState = store.getState();

  const merged = {
    ...storeInitialState,
    ...partialState,
  };

  return createTestStore({ initialState: merged }).getState();
};
