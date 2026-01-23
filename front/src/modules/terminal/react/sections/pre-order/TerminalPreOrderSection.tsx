'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, AppState } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { seatReservation } from '../../../core/useCase/seat-reservation.usecase';
import { savePreOrders } from '../../../core/useCase/save-pre-orders.usecase';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { fetchMeals } from '@taotask/modules/order/core/useCase/fetch-meals.usecase';
import { fetchMenus } from '@taotask/modules/order/core/useCase/fetch-menus.usecase';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { MealsSection } from '@taotask/modules/order/react/sections/meals/MealsSection';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { Loader2 } from 'lucide-react';

export const TerminalPreOrderSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const reservation = useSelector((state: AppState) => state.terminal.reservation);
    const restaurantId = useSelector((state: AppState) => state.terminal.restaurantId);
    const mealsStatus = useSelector((state: AppState) => state.ordering.availableMeals.status);
    const menusStatus = useSelector((state: AppState) => state.ordering.availableMenus.status);
    const orderingStep = useSelector((state: AppState) => state.ordering.step);

    // Initialize ordering state with reservation guests
    useEffect(() => {
        if (reservation && restaurantId) {
            // Set terminal mode and restaurant
            dispatch(orderingActions.setTerminalMode(true));
            dispatch(orderingActions.setRestaurantId(restaurantId));

            // Convert terminal guests to ordering guests
            const orderingGuests: OrderingDomainModel.Guest[] = reservation.guests.map(guest => ({
                id: guest.id.toString(),
                firstName: guest.firstName,
                lastName: guest.lastName,
                age: guest.age,
                isOrganizer: guest.isOrganizer,
                restaurantId: restaurantId,
                menuId: null,
                meals: {
                    entries: guest.meals.entry ? [{ mealId: guest.meals.entry.mealId, quantity: guest.meals.entry.quantity }] : [],
                    mainCourses: guest.meals.mainCourse ? [{ mealId: guest.meals.mainCourse.mealId, quantity: guest.meals.mainCourse.quantity }] : [],
                    desserts: guest.meals.dessert ? [{ mealId: guest.meals.dessert.mealId, quantity: guest.meals.dessert.quantity }] : [],
                    drinks: guest.meals.drink ? [{ mealId: guest.meals.drink.mealId, quantity: guest.meals.drink.quantity }] : [],
                },
            }));

            const organizer = orderingGuests.find(g => g.isOrganizer);

            // Initialize form with guests
            dispatch(orderingActions.chooseGuests({
                guests: orderingGuests,
                organizerId: organizer?.id || orderingGuests[0]?.id || null,
                tableId: reservation.tableId.toString(),
            }));

            // Set step to MEALS
            dispatch(orderingActions.setStep(OrderingDomainModel.OrderingStep.MEALS));

            // Fetch meals and menus
            dispatch(fetchMeals as any);
            dispatch(fetchMenus as any);
        }
    }, [reservation, restaurantId, dispatch]);

    // Listen for ordering step changes to handle completion
    useEffect(() => {
        if (orderingStep === OrderingDomainModel.OrderingStep.SUMMARY) {
            // User completed meal selection, save pre-orders and seat them
            const completePreOrder = async () => {
                await dispatch(savePreOrders());
                await dispatch(seatReservation());
            };
            completePreOrder();
        }
    }, [orderingStep, dispatch]);

    const isLoading = mealsStatus === 'loading' || menusStatus === 'loading';

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <LuminousCard className="max-w-lg w-full text-center py-12 px-8">
                    <Loader2 className="w-12 h-12 text-luminous-gold animate-spin mx-auto mb-4" />
                    <p className="text-luminous-text-secondary">Chargement du menu...</p>
                </LuminousCard>
            </div>
        );
    }

    if (!reservation) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <MealsSection />
        </div>
    );
};
