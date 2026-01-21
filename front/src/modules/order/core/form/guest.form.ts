import { produce } from "immer";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { IIDProvider } from "@taotask/modules/core/id-provider";
export class GuestForm {
    constructor(
        private idProvider:IIDProvider
    ) { }

    addGuest(state:OrderingDomainModel.Form) {
        
        
        
        return produce(state, (draft: any) => {
            
            draft.guests.push({
                id: this.idProvider.generate(),
                firstName: 'John',
                lastName: 'Doe',
                age: 24,
                restaurantId: null,
                isOrganizer: false
            })
        })
    }

    removeGuest(state:OrderingDomainModel.Form, id:string) {
        
        return produce (state, (draft: any) => {
            const index = draft.guests.findIndex((guest: any) => guest.id === id)
            if (index < 0) {
                return
            }
            draft.guests.splice(index, 1)
            if(draft.organizerId === id) {
                draft.organizerId = null
            }
        })
    }

    changeOrganizer(state: OrderingDomainModel.Form, id:string) {
        
        return produce(state, (draft: any) => {
            const exists = draft.guests.some((guest: any) => guest.id === id);
            
            if(!exists) {
                return
            }
            draft.organizerId = id;
        });

    }

    isSubmitable(state: OrderingDomainModel.Form) {
        return (
            state.organizerId !== null 
            && state.guests.every((guest) => guest.age > 0
            && guest.firstName.length > 0
            && guest.lastName.length > 0)
        )
    }

    updateGuest<T extends keyof OrderingDomainModel.Guest>(
        state: OrderingDomainModel.Form, 
        id:string, 
        key:T, 
        value:OrderingDomainModel.Guest[T]) {

        return produce(state, (draft: any) => {
            const guest = draft.guests.find((guest: any) => guest.id === id)
            
            if (!guest) {
                return
            }
            guest[key] = value
        })
    }
}