import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TerminalDomainModel } from '../model/terminal.domain-model';

export type LookupStatus = 'idle' | 'loading' | 'success' | 'error';

export type TerminalState = {
    step: TerminalDomainModel.TerminalStep;
    restaurantId: string | null;
    identifyMode: TerminalDomainModel.IdentifyMode | null;
    reservationCode: string | null;
    guestCount: number;
    reservation: TerminalDomainModel.Reservation | null;
    error: string | null;
    lookupStatus: LookupStatus;
};

const initialState: TerminalState = {
    step: TerminalDomainModel.TerminalStep.WELCOME,
    restaurantId: null,
    identifyMode: null,
    reservationCode: null,
    guestCount: 1,
    reservation: null,
    error: null,
    lookupStatus: 'idle',
};

export const terminalSlice = createSlice({
    name: 'terminal',
    initialState,
    reducers: {
        setRestaurantId: (state, action: PayloadAction<string>) => {
            state.restaurantId = action.payload;
        },
        setStep: (state, action: PayloadAction<TerminalDomainModel.TerminalStep>) => {
            state.step = action.payload;
        },
        chooseReservationMode: (state) => {
            state.identifyMode = 'reservation';
            state.step = TerminalDomainModel.TerminalStep.IDENTIFY;
        },
        chooseWalkInMode: (state) => {
            state.identifyMode = 'walkin';
            state.step = TerminalDomainModel.TerminalStep.IDENTIFY;
        },
        setReservationCode: (state, action: PayloadAction<string>) => {
            state.reservationCode = action.payload;
        },
        setGuestCount: (state, action: PayloadAction<number>) => {
            state.guestCount = action.payload;
        },
        setReservation: (state, action: PayloadAction<TerminalDomainModel.Reservation>) => {
            state.reservation = action.payload;
            state.lookupStatus = 'success';
        },
        setLookupLoading: (state) => {
            state.lookupStatus = 'loading';
            state.error = null;
        },
        setLookupError: (state, action: PayloadAction<string>) => {
            state.lookupStatus = 'error';
            state.error = action.payload;
        },
        goToMenuBrowse: (state) => {
            state.step = TerminalDomainModel.TerminalStep.MENU_BROWSE;
        },
        goToConfirmation: (state) => {
            state.step = TerminalDomainModel.TerminalStep.CONFIRMATION;
        },
        goToPreOrder: (state) => {
            state.step = TerminalDomainModel.TerminalStep.PRE_ORDER;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        reset: () => initialState,
    },
});

export const terminalActions = terminalSlice.actions;
export const terminalReducer = terminalSlice.reducer;
