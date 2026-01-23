import { configureStore } from '@reduxjs/toolkit';
import { kitchenReducer } from '../modules/kitchen';

export const store = configureStore({
  reducer: {
    kitchen: kitchenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
