import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { KitchenDomainModel } from '../model/kitchen.domain-model';
import { IKitchenGateway } from '../gateway/kitchen.gateway';

export type KitchenState = {
  orders: KitchenDomainModel.KitchenOrder[];
  filter: KitchenDomainModel.FilterType;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
};

const initialState: KitchenState = {
  orders: [],
  filter: 'all',
  loading: false,
  error: null,
  lastFetch: null,
};

// Async thunks will be created with the gateway injected
export const createKitchenThunks = (gateway: IKitchenGateway) => ({
  fetchOrders: createAsyncThunk(
    'kitchen/fetchOrders',
    async (restaurantId: number) => {
      return gateway.getOrders(restaurantId);
    },
  ),

  markCourseReady: createAsyncThunk(
    'kitchen/markCourseReady',
    async ({
      reservationId,
      course,
    }: {
      reservationId: number;
      course: KitchenDomainModel.CourseType;
    }) => {
      return gateway.markCourseReady(reservationId, course);
    },
  ),
});

export const kitchenSlice = createSlice({
  name: 'kitchen',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<KitchenDomainModel.FilterType>) => {
      state.filter = action.payload;
    },
    setOrders: (
      state,
      action: PayloadAction<KitchenDomainModel.KitchenOrder[]>,
    ) => {
      state.orders = action.payload;
      state.lastFetch = Date.now();
    },
    updateOrder: (
      state,
      action: PayloadAction<KitchenDomainModel.KitchenOrder>,
    ) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) {
        // If status is COMPLETED or not in our display statuses, remove it
        if (
          action.payload.status !== 'SEATED' &&
          action.payload.status !== 'IN_PREPARATION'
        ) {
          state.orders.splice(index, 1);
        } else {
          state.orders[index] = action.payload;
        }
      }
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const kitchenActions = kitchenSlice.actions;
export const kitchenReducer = kitchenSlice.reducer;

// Selectors
export const selectOrders = (state: { kitchen: KitchenState }) =>
  state.kitchen.orders;

export const selectFilter = (state: { kitchen: KitchenState }) =>
  state.kitchen.filter;

export const selectFilteredOrders = (state: { kitchen: KitchenState }) => {
  const { orders, filter } = state.kitchen;

  if (filter === 'all') {
    return orders;
  }

  // Filter orders that have items of the selected type not yet ready
  return orders.filter((order) => {
    const hasCourse = order.meals[filter].count > 0;
    const isReady = order.coursesReady[filter];
    return hasCourse && !isReady;
  });
};

export const selectLoading = (state: { kitchen: KitchenState }) =>
  state.kitchen.loading;

export const selectError = (state: { kitchen: KitchenState }) =>
  state.kitchen.error;
