import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BackofficeDomainModel } from "../model/backoffice.domain-model";

export type BackofficeState = {
    
}

export const initialState: BackofficeState = {
    
}

export const backofficeSlice = createSlice({
    name: 'backoffice',
    initialState,
    reducers: {
        
    }
});

export const backofficeReducer = backofficeSlice.reducer;
export const backofficeActions = backofficeSlice.actions;
