import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export type BackofficeState = {
    restaurants: BackofficeDomainModel.Restaurant[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: BackofficeState = {
    restaurants: [],
    isLoading: false,
    error: null
}

export const backofficeSlice = createSlice({
    name: 'backoffice',
    initialState,
    reducers: {
        storeRestaurant: (state, action: PayloadAction<BackofficeDomainModel.Restaurant>) => {
            state.restaurants.push(action.payload);
        }
    }
});

export const backofficeReducer = backofficeSlice.reducer;
export const backofficeActions = backofficeSlice.actions;