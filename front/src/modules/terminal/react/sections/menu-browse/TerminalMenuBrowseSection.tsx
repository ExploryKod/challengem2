'use client';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch, AppState } from '@taotask/modules/store/store';
import { terminalActions } from '../../../core/store/terminal.slice';
import { seatReservation } from '../../../core/useCase/seat-reservation.usecase';
import { fetchMeals } from '@taotask/modules/order/core/useCase/fetch-meals.usecase';
import { fetchMenus } from '@taotask/modules/order/core/useCase/fetch-menus.usecase';
import { orderingActions } from '@taotask/modules/order/core/store/ordering.slice';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { UtensilsCrossed, ArrowLeft, Loader2 } from 'lucide-react';

const MEAL_TYPE_LABELS: Record<OrderingDomainModel.MealType, string> = {
    ENTRY: 'E',
    MAIN_COURSE: 'P',
    DESSERT: 'D',
    DRINK: 'B',
};

const formatMenuItems = (items: OrderingDomainModel.MenuItem[]): string => {
    return items
        .filter(item => item.quantity > 0)
        .map(item => `${item.quantity}${MEAL_TYPE_LABELS[item.mealType]}`)
        .join(' + ');
};

const mealTypes: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "Entree",
    "MAIN_COURSE": "Plat",
    "DESSERT": "Dessert",
    "DRINK": "Boisson",
};

const mealBadgeStyles: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "bg-luminous-meal-entry-bg text-luminous-meal-entry",
    "MAIN_COURSE": "bg-luminous-meal-main-bg text-luminous-meal-main",
    "DESSERT": "bg-luminous-meal-dessert-bg text-luminous-meal-dessert",
    "DRINK": "bg-luminous-meal-drink-bg text-luminous-meal-drink",
};

const mealBorder: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "border-luminous-meal-entry",
    "MAIN_COURSE": "border-luminous-meal-main",
    "DESSERT": "border-luminous-meal-dessert",
    "DRINK": "border-luminous-meal-drink",
};

export const TerminalMenuBrowseSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const reservation = useSelector((state: AppState) => state.terminal.reservation);
    const restaurantId = useSelector((state: AppState) => state.terminal.restaurantId);
    const meals = useSelector((state: AppState) => state.ordering.availableMeals.data);
    const mealsStatus = useSelector((state: AppState) => state.ordering.availableMeals.status);
    const menus = useSelector((state: AppState) => state.ordering.availableMenus.data);
    const menusStatus = useSelector((state: AppState) => state.ordering.availableMenus.status);

    useEffect(() => {
        if (restaurantId) {
            dispatch(orderingActions.setRestaurantId(restaurantId));
            dispatch(fetchMeals as any);
            dispatch(fetchMenus as any);
        }
    }, [restaurantId, dispatch]);

    const handlePreOrder = () => {
        dispatch(terminalActions.goToPreOrder());
    };

    const handleSkip = () => {
        dispatch(seatReservation());
    };

    const handleBack = () => {
        dispatch(terminalActions.reset());
    };

    const isLoading = mealsStatus === 'loading' || menusStatus === 'loading';

    const groupedMeals = {
        [OrderingDomainModel.MealType.ENTRY]: meals.filter(m => m.type === OrderingDomainModel.MealType.ENTRY),
        [OrderingDomainModel.MealType.MAIN_COURSE]: meals.filter(m => m.type === OrderingDomainModel.MealType.MAIN_COURSE),
        [OrderingDomainModel.MealType.DESSERT]: meals.filter(m => m.type === OrderingDomainModel.MealType.DESSERT),
        [OrderingDomainModel.MealType.DRINK]: meals.filter(m => m.type === OrderingDomainModel.MealType.DRINK),
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <LuminousCard className="max-w-4xl w-full py-8 px-6">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-luminous-text-secondary hover:text-luminous-gold transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-luminous-gold/10 flex items-center justify-center mx-auto mb-4">
                        <UtensilsCrossed className="w-8 h-8 text-luminous-gold" />
                    </div>
                    <h2 className="text-2xl font-display font-medium text-luminous-text-primary mb-2">
                        Bienvenue {reservation?.guests[0]?.firstName}
                    </h2>
                    <p className="text-luminous-text-secondary">
                        Souhaitez-vous pre-commander vos plats ?
                    </p>
                    <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
                </div>

                {/* Menu preview - compact version */}
                <div className="max-h-[400px] overflow-y-auto mb-8 space-y-6">
                    {/* Menus section */}
                    {menus.length > 0 && (
                        <div>
                            <h4 className="text-sm font-display font-medium text-luminous-text-primary mb-3 uppercase tracking-wide">
                                Nos Menus
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {menus.slice(0, 3).map((menu) => (
                                    <div key={menu.id} className="rounded-lg overflow-hidden border border-luminous-gold-border bg-luminous-bg-card">
                                        {menu.imageUrl && (
                                            <Image
                                                width={200}
                                                height={100}
                                                src={menu.imageUrl}
                                                alt={menu.title}
                                                className="w-full h-[80px] object-cover"
                                            />
                                        )}
                                        <div className="p-2">
                                            <h5 className="text-xs font-semibold text-luminous-text-primary truncate">
                                                {menu.title}
                                            </h5>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-luminous-gold-muted">
                                                    {formatMenuItems(menu.items)}
                                                </span>
                                                <span className="text-sm font-bold text-luminous-gold">
                                                    {menu.price} EUR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Meals by category - compact */}
                    {Object.values(OrderingDomainModel.MealType).map((type) => {
                        const mealsOfType = groupedMeals[type];
                        if (mealsOfType.length === 0) return null;

                        return (
                            <div key={type}>
                                <h4 className="text-sm font-display font-medium text-luminous-text-primary mb-3 uppercase tracking-wide">
                                    {mealTypes[type]}s
                                </h4>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {mealsOfType.slice(0, 5).map((meal) => (
                                        <div key={meal.id} className="flex-shrink-0 w-[100px]">
                                            <div className={`relative rounded-lg overflow-hidden border ${mealBorder[meal.type]} bg-luminous-bg-card`}>
                                                <span className={`absolute top-1 left-1 z-10 ${mealBadgeStyles[meal.type]} px-1.5 py-0.5 rounded-full text-[10px] font-medium`}>
                                                    {mealTypes[meal.type]}
                                                </span>
                                                <Image
                                                    width={100}
                                                    height={80}
                                                    src={meal.imageUrl}
                                                    alt={meal.title}
                                                    className="w-full h-[70px] object-cover"
                                                />
                                                <div className="p-2">
                                                    <h5 className="text-xs font-medium text-luminous-text-primary truncate">
                                                        {meal.title}
                                                    </h5>
                                                    <p className="text-xs font-semibold text-luminous-gold text-center">
                                                        {meal.price} EUR
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <LuminousButton
                        variant="secondary"
                        onClick={handleSkip}
                        className="py-4 px-8"
                    >
                        Passer
                    </LuminousButton>
                    <LuminousButton
                        variant="primary"
                        onClick={handlePreOrder}
                        className="py-4 px-8"
                    >
                        Pre-commander
                    </LuminousButton>
                </div>
            </LuminousCard>
        </div>
    );
};
