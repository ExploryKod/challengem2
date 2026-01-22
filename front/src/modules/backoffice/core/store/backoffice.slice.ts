import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export type BackofficeState = {
    restaurants: BackofficeDomainModel.Restaurant[];
    selectedRestaurantId: number | null;
    tables: BackofficeDomainModel.Table[];
    meals: BackofficeDomainModel.Meal[];
    reservations: BackofficeDomainModel.Reservation[];
    isLoading: boolean;
    error: string | null;
};

export const initialState: BackofficeState = {
    restaurants: [],
    selectedRestaurantId: null,
    tables: [],
    meals: [],
    reservations: [],
    isLoading: false,
    error: null,
};

export const backofficeSlice = createSlice({
    name: 'backoffice',
    initialState,
    reducers: {
        setRestaurants: (state, action: PayloadAction<BackofficeDomainModel.Restaurant[]>) => {
            state.restaurants = action.payload;
        },
        storeRestaurant: (state, action: PayloadAction<BackofficeDomainModel.Restaurant>) => {
            state.restaurants.push(action.payload);
        },
        updateRestaurant: (state, action: PayloadAction<BackofficeDomainModel.Restaurant>) => {
            const index = state.restaurants.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.restaurants[index] = action.payload;
            }
        },
        removeRestaurant: (state, action: PayloadAction<number>) => {
            state.restaurants = state.restaurants.filter(r => r.id !== action.payload);
            if (state.selectedRestaurantId === action.payload) {
                state.selectedRestaurantId = null;
                state.tables = [];
                state.meals = [];
                state.reservations = [];
            }
        },
        selectRestaurant: (state, action: PayloadAction<number | null>) => {
            state.selectedRestaurantId = action.payload;
            state.tables = [];
            state.meals = [];
            state.reservations = [];
        },
        setTables: (state, action: PayloadAction<BackofficeDomainModel.Table[]>) => {
            state.tables = action.payload;
        },
        storeTable: (state, action: PayloadAction<BackofficeDomainModel.Table>) => {
            state.tables.push(action.payload);
        },
        updateTable: (state, action: PayloadAction<BackofficeDomainModel.Table>) => {
            const index = state.tables.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.tables[index] = action.payload;
            }
        },
        removeTable: (state, action: PayloadAction<number>) => {
            state.tables = state.tables.filter(t => t.id !== action.payload);
        },
        setMeals: (state, action: PayloadAction<BackofficeDomainModel.Meal[]>) => {
            state.meals = action.payload;
        },
        storeMeal: (state, action: PayloadAction<BackofficeDomainModel.Meal>) => {
            state.meals.push(action.payload);
        },
        updateMeal: (state, action: PayloadAction<BackofficeDomainModel.Meal>) => {
            const index = state.meals.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.meals[index] = action.payload;
            }
        },
        removeMeal: (state, action: PayloadAction<number>) => {
            state.meals = state.meals.filter(m => m.id !== action.payload);
        },
        setReservations: (state, action: PayloadAction<BackofficeDomainModel.Reservation[]>) => {
            state.reservations = action.payload;
        },
        storeReservation: (state, action: PayloadAction<BackofficeDomainModel.Reservation>) => {
            state.reservations.push(action.payload);
        },
        updateReservation: (state, action: PayloadAction<BackofficeDomainModel.Reservation>) => {
            const index = state.reservations.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.reservations[index] = action.payload;
            }
        },
        removeReservation: (state, action: PayloadAction<number>) => {
            state.reservations = state.reservations.filter(r => r.id !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const backofficeReducer = backofficeSlice.reducer;
export const backofficeActions = backofficeSlice.actions;
