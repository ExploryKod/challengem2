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
        mealId: OrderingDomainModel.MealId | null,
        quantity: number = 1
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
            // Toggle: if same meal, set to null; otherwise set new meal with quantity
            if (guest.meals.entry?.mealId === mealId) {
                guest.meals.entry = null;
            } else if (mealId) {
                guest.meals.entry = { mealId, quantity };
            } else {
                guest.meals.entry = null;
            }
        });
    }

    assignMainCourse(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null,
        quantity: number = 1
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
            // Toggle: if same meal, set to null; otherwise set new meal with quantity
            if (guest.meals.mainCourse?.mealId === mealId) {
                guest.meals.mainCourse = null;
            } else if (mealId) {
                guest.meals.mainCourse = { mealId, quantity };
            } else {
                guest.meals.mainCourse = null;
            }
        });
    }

    assignDessert(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null,
        quantity: number = 1
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
            // Toggle: if same meal, set to null; otherwise set new meal with quantity
            if (guest.meals.dessert?.mealId === mealId) {
                guest.meals.dessert = null;
            } else if (mealId) {
                guest.meals.dessert = { mealId, quantity };
            } else {
                guest.meals.dessert = null;
            }
        });
    }

    assignDrink(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealId: OrderingDomainModel.MealId | null,
        quantity: number = 1
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if(!guest) {
                return;
            }
            // Toggle: if same meal, set to null; otherwise set new meal with quantity
            if (guest.meals.drink?.mealId === mealId) {
                guest.meals.drink = null;
            } else if (mealId) {
                guest.meals.drink = { mealId, quantity };
            } else {
                guest.meals.drink = null;
            }
        });
    }

    updateQuantity(
        form: OrderingDomainModel.Form,
        guestId: string | number,
        mealType: OrderingDomainModel.MealType,
        quantity: number
    ) {
        return produce(form, draft => {
            const guest = draft.guests.find(guest => guest.id === guestId);
            if (!guest) return;

            const mealKey = this.getMealKey(mealType);
            const currentSelection = guest.meals[mealKey];

            if (currentSelection) {
                if (quantity <= 0) {
                    guest.meals[mealKey] = null;
                } else {
                    guest.meals[mealKey] = { ...currentSelection, quantity };
                }
            }
        });
    }

    private getMealKey(mealType: OrderingDomainModel.MealType): keyof OrderingDomainModel.Guest['meals'] {
        switch (mealType) {
            case OrderingDomainModel.MealType.ENTRY: return 'entry';
            case OrderingDomainModel.MealType.MAIN_COURSE: return 'mainCourse';
            case OrderingDomainModel.MealType.DESSERT: return 'dessert';
            case OrderingDomainModel.MealType.DRINK: return 'drink';
        }
    }

    isSubmitable(state: OrderingDomainModel.Form) {
        return state.guests.every((guest) => guest.meals.mainCourse !== null)
    }
}

