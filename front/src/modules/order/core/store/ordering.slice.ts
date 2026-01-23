import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type OrderingState = {
    step: OrderingDomainModel.OrderingStep,
    form: OrderingDomainModel.Form,
    restaurantId: OrderingDomainModel.RestaurantId,
    isTerminalMode: boolean;
    availableTables: {
        data: OrderingDomainModel.Table[];
        status: 'idle' | 'loading' | 'success' | 'error';
        error: string | null;
    };
    availableMeals: {
        data: OrderingDomainModel.Meal[];
        status: 'idle' | 'loading' | 'success' | 'error';
        error: string | null;
    };
    reservation: ReservationStatus;
}

export type ReservationStatus = { status: "idle" } | {status: "loading" } | {status: "success"} | {status: "error", error: string}

export const initialState: OrderingState = {
    step: OrderingDomainModel.OrderingStep.RESTAURANT,
    form: {
        guests: [],
        organizerId: null,
        tableId: null
    },
    restaurantId: null,
    isTerminalMode: false,
    availableTables: {
        status: 'idle',
        error: null,
        data: []
    },
    availableMeals: {
        status: 'idle',
        error: null,
        data: []
    },
    reservation: { status: "idle" }
}
// On va séparer les logiques et utiliser l'event driven dev (en version simplifiée) > voir store.ts
// On va rassembler a logique entière qui suit l'étape de choix de guest dans un autre endroit, dans un listener
// voir 'Gestion des étapes' 5.45s
export const orderingSlice = createSlice({
    name: 'ordering',
    initialState,
    reducers: {
        setStep: (state, action:PayloadAction<OrderingDomainModel.OrderingStep>) => {
            state.step = action.payload;
            // Version non-fonctionnel mais utile au début pour accéder juste à la section TABLE
            // state.step = OrderingDomainModel.OrderingStep.TABLE;
        },
        // Ici j'écris ce reducer suite à avoir écris le 4. de fetch-table.usecase.ts 
        // Ici pas besoin d'action car on ne fait que changer le status 
        // Aprés cette étape on doit retourner voir les test de 2. pour voir si ça passe
        handleTablesLoading: (state) => {
            state.availableTables.status = 'loading';
            state.availableTables.error = null;
        },
        // Ici j'écris ce reducer suite à avoir écris le 5. de fetch-table.usecase.ts
        // Ici on avait pas besoin d'action tant qu' on ne faisait que changer le status mais pour l'erreur on a besoin de l'action
        handleTablesError: (state, action: PayloadAction<string>) => {
            state.availableTables.status = 'error';
            state.availableTables.error = action.payload;
        },
        storeTables(state, action:PayloadAction<OrderingDomainModel.Table[]>){
            state.availableTables.data = action.payload;
            state.availableTables.status = 'success';
        },
        setRestaurantId: (state, action: PayloadAction<OrderingDomainModel.RestaurantId>) => {
            state.restaurantId = action.payload;
        },
        setTerminalMode: (state, action: PayloadAction<boolean>) => {
            state.isTerminalMode = action.payload;
        },
        chooseGuests: (state, action:PayloadAction<OrderingDomainModel.Form>) => {
            state.form = action.payload;
        },
        chooseTable: (state, action:PayloadAction<string>) => {
            state.form.tableId = action.payload;
            // Ne sert plus car on a créé un listener:
            // state.step = OrderingDomainModel.OrderingStep.MEALS;
        },
        handleMealsError: (state, action: PayloadAction<string>) => {
            state.availableMeals.status = 'error';
            state.availableMeals.error = action.payload;
        },
        storeMeals: (state, action:PayloadAction<OrderingDomainModel.Meal[]>) => {
            state.availableMeals.data = action.payload;
            state.availableMeals.status = 'success';
        },
        handleMealsLoading: (state) => {
            state.availableMeals.status = 'loading';
            state.availableMeals.error = null;
        },
        chooseMeal: (state, action:PayloadAction<OrderingDomainModel.Form>) => {
            state.form = action.payload;
        },
        handleReservationLoading: (state) => {
            state.reservation = {
                status: "loading"
            }
        },
        handleReservationError: (state) => {
            state.reservation = {
                status: "error",
                error: "Reservation failed"
            }
        },
        handleReservationSuccess: (state) => {
            state.reservation = {
                status: "success"
            }
            state.step = OrderingDomainModel.OrderingStep.RESERVED;
        }
    }
});

export const orderingReducer = orderingSlice.reducer;
export const orderingActions = orderingSlice.actions;




