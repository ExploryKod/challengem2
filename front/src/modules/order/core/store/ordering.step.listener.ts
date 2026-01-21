import { ListenerMiddlewareInstance } from "@reduxjs/toolkit";
import { orderingSlice } from "./ordering.slice";
import { OrderingDomainModel } from "../model/ordering.domain-model";

// On concentrer toute la logique de gestion des étapes via redux ici
//On sépare donc cela des config pure de redux présente dans store.ts (on appel là bas que cette fonction créé ici)
export const registerOrderingStepListener = (listener: ListenerMiddlewareInstance) => {
    listener.startListening({
        // Dés que l'on choisis un guest on passe à l'étape de choix de table (voir ordering.slice.ts)
        // On fait de l'évent driven archi simple >> effect est comme un useEffect, le listener écoute l'action chooseGuests et lance l'effet
        // Je choisi donc ici un évènement de type actionCreator
        actionCreator: orderingSlice.actions.chooseGuests,
        effect: (_, api) => {
          api.dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.TABLE));
        }
      });

      listener.startListening({
        // Dés que l'on choisis une table on passe à l'étape de choix de meal (voir ordering.slice.ts)
        actionCreator: orderingSlice.actions.chooseTable,
        effect: (_, api) => {
          api.dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.MEALS));
        }
      });

    listener.startListening({
        // Dés que l'on choisis un repas on passe à l'étape suivante (sommaire) (voir ordering.slice.ts)
        actionCreator: orderingSlice.actions.chooseMeal,
        effect: (_, api) => {
            api.dispatch(orderingSlice.actions.setStep(OrderingDomainModel.OrderingStep.SUMMARY));
        }
    });
}