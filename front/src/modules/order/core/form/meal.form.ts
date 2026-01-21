import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { produce } from 'immer';
// Refactoring > Extract conditions to made these as private methods (or properties ??) to have arguments
// Condition qui return false puis true: voir si je peux pas direct return la condition (qui retourne true ou false)
export class MealForm {

    private isMealType(meal: OrderingDomainModel.Meal, type: OrderingDomainModel.MealType) {
        return meal.type === type;
    }

    private hasRequiredAge(meal: OrderingDomainModel.Meal, guest: OrderingDomainModel.Guest) {
        if(meal.requiredAge === null) {
            return true;
        }
        return guest.age >= meal.requiredAge;
    }

    getSelectableEntries(
        meals: OrderingDomainModel.Meal[],
        guest: OrderingDomainModel.Guest
    ) {
               
    return meals.filter(meal => {
            return !(
            !this.isMealType(meal, OrderingDomainModel.MealType.ENTRY) || 
            !this.hasRequiredAge(meal, guest)) 
            });
    }

    getSelectableMainCourse(
        meals: OrderingDomainModel.Meal[],
        guest: OrderingDomainModel.Guest
    ) {
               
    return meals.filter(meal => {
            return !(
            !this.isMealType(meal, OrderingDomainModel.MealType.MAIN_COURSE) || 
            !this.hasRequiredAge(meal, guest)) 
            });
    }

    getSelectableDessert(
        meals: OrderingDomainModel.Meal[],
        guest: OrderingDomainModel.Guest
    ) {
               
    return meals.filter(meal => {
            return !(
            !this.isMealType(meal, OrderingDomainModel.MealType.DESSERT) || 
            !this.hasRequiredAge(meal, guest)) 
            });
    }

    getSelectableDrink(
        meals: OrderingDomainModel.Meal[],
        guest: OrderingDomainModel.Guest
    ) {
               
    return meals.filter(meal => {
            return !(
            !this.isMealType(meal, OrderingDomainModel.MealType.DRINK) || 
            !this.hasRequiredAge(meal, guest)) 
            });
    }

    assignEntry(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
           guest.meals.entry = mealId;
        });
    }

    assignMainCourse(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
           guest.meals.mainCourse = mealId;
        });
    }

    assignDessert(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
           guest.meals.dessert = mealId;
        });
    }

    assignDrink(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
           guest.meals.drink = mealId;
        });
    }

    isSubmitable(state: OrderingDomainModel.Form) {
        return state.guests.every((guest) => guest.meals.mainCourse !== null)
    }
}

// Before refactoring
// export class MealForm {

//     getSelectableEntries(
//         meals: OrderingDomainModel.Meal[],
//         guest: OrderingDomainModel.Guest
//     ) {
//         return meals.filter(meal => {
//             if(meal.type !== OrderingDomainModel.MealType.ENTRY) {
//                 return false;
//             }
//             if(meal.requiredAge && guest.age < meal.requiredAge) {
//                 return false;
//             }
//             return true;
//         });
//     }
// }