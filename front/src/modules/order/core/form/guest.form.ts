import { produce } from "immer";
import { OrderingDomainModel } from "@taotask/modules/order/core/model/ordering.domain-model";
import { IIDProvider } from "@taotask/modules/core/id-provider";
export class GuestForm {
    constructor(
        private idProvider:IIDProvider
    ) { }

    addGuest(state:OrderingDomainModel.Form, menuId: string | null = null) {
        // On ajoute ici temporairement le state pour mimer un paradigme fonctionnel
        // Création de Form pour éviter de spécifier via des commentaires qu'il faut un unique organisateur

        // Voir le cours sur immer et le paradigme fonctionnel vs impératif, pourquoi ici j'utilise dans produce le p imp.
        return produce(state, (draft: any) => {
            // je peux travailler sur draft comme si c'était un state, de façon immutable dans p. imp.
            draft.guests.push({
                id: this.idProvider.generate(),
                firstName: 'John',
                lastName: 'Doe',
                age: 24,
                restaurantId: null,
                isOrganizer: false,
                menuId: menuId,
                meals: {entry: null, mainCourse: null, dessert: null, drink: null}
            })
        })

        // ANCIENNE VERSION POUR COMPARARER AVEC LE REFACTO AVEC IMMER
        // return {
        //     ...state,
        //     guests: [
        //         ...state.guests,
        //         {
        //             id:this.idProvider.generate(),
        //             firstName: 'John',
        //             lastName: 'Doe',
        //             age: 0
        //         }
        //     ]
        // };
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
        
        // return {
        //     ...state,
        //     guests: state.guests.filter(guest => guest.id !== id)
        // }
    }

    changeOrganizer(state: OrderingDomainModel.Form, id:string) {
        
        return produce(state, (draft: any) => {
            const exists = draft.guests.some((guest: any) => guest.id === id);
            
            if(!exists) {
                return
            }
            draft.organizerId = id;
        });
    
       
        // La méthode some() teste si au moins un élément du tableau passe le test implémenté par la fonction fournie. 
        // Elle renvoie un booléen indiquant le résultat du test
        // return {
        //     ...state,
        //     organizerId: state.guests.some((guest) => guest.id ===  id) ? id : null
        // }
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
            // on commence par une négation (mieux) que de vérifier si guest est true et mettre guest[key] dans la condition
            if (!guest) {
                return
            }
            guest[key] = value
        })

        // return {
        //     ...state,
        //     guests: state.guests.map((guest) => {
        //         if (guest.id === id) {
        //             console.log('update guest ', key, value)
        //             return {
        //                 ...guest,
        //                 [key]: value
        //             }
        //         } else {
        //             return guest;
        //         }
               
        //     })
        // }
    }
}