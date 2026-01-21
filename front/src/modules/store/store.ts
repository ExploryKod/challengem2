import { useDispatch } from "react-redux";
import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { orderingReducer } from "@taotask/modules/order/core/store/ordering.slice";
import { Dependencies } from "@taotask/modules/store/dependencies";

// Pour nos tests de départ 
const dummyReducer = (state = {}) => state;

const reducers = combineReducers({
  app: dummyReducer,
  ordering: orderingReducer,
});

export type AppStore = ReturnType<typeof createStore>;
export type AppState = ReturnType<typeof reducers>;
export type AppDispatch = AppStore["dispatch"];
export type AppGetState = AppStore["getState"];

export const createStore = (config: {
  initialState?: AppState;
  dependencies: Dependencies;
}) => {
  const store = configureStore({
    preloadedState: config?.initialState,
    reducer: reducers,
    devTools: true,
    middleware: (getDefaultMiddleware) => {
      const listener = createListenerMiddleware();

      return getDefaultMiddleware({
        thunk: {
          extraArgument: config.dependencies,
        },
      }).prepend(listener.middleware);
    },
  });

  return store;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();