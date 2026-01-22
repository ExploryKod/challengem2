"use client";
import React from 'react';
import { useGuestSection } from "@taotask/modules/order/react/sections/guest/use-guest-section";
import { Trash2, Check } from "lucide-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

export const GuestSection: React.FC<{
    restaurantList: OrderingDomainModel.RestaurantList;
    meals?: OrderingDomainModel.Meal[];
}> = ({restaurantList, meals = []}) => {
    const presenter:any = useGuestSection();

    const mealTypes: Record<OrderingDomainModel.MealType, string> = {
        "ENTRY": "Entrée",
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

    return (
        <div className="flex flex-col gap-6">
            {/* Guest Form Section */}
            <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
                <div className="flex flex-col mx-auto mb-5 w-full">
                    {restaurantList.restaurantId ?
                        <h2 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center">
                        Qui voulez-vous inviter chez &quot;{restaurantList.restaurants
                        .filter((restaurant:OrderingDomainModel.Restaurant) => restaurant.id === restaurantList.restaurantId)[0].restaurantName}&quot; ?
                        </h2> :
                        <h2 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center">Pour inviter, choisissez un restaurant</h2>}
                    <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
                    <span className="mx-auto my-2 text-luminous-text-secondary text-sm sm:text-base italic text-center max-w-[600px]">Pour des raisons de sécurité, choisissez obligatoirement au moins un capitaine de soirée : l&#39;organisateur.</span>
                    <span className="mx-auto my-1 text-luminous-text-muted text-sm italic text-center max-w-[600px]">L&#39;organisateur est la personne qui ne boit pas et se charge du déplacement des invités.</span>
                </div>

                {restaurantList.restaurantId && presenter.form.guests.map((guest:any) => (
                    <div key={guest.id}>
                        <GuestRows
                            id={guest.id}
                            firstName={guest.firstName}
                            lastName={guest.lastName}
                            age={guest.age}
                            onChange={presenter.updateGuest}
                            remove={presenter.removeGuest}
                            changeOrganizer={presenter.changeOrganizer}
                            isOrganizer={guest.id === presenter.form.organizerId}
                            checkboxRef={presenter.checkBoxOrganizer}
                        />
                    </div>
                ))}

                <div ref={presenter.bottomGuestRef} className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-6">
                    <LuminousButton
                        onClick={presenter.addGuest}
                        variant="secondary"
                    >
                        + Inviter une personne
                    </LuminousButton>
                    <LuminousButton
                        onClick={presenter.onNext}
                        disabled={presenter.isSubmitable === false}
                        variant="success"
                    >
                        Suivant
                    </LuminousButton>
                </div>
            </LuminousCard>

            {/* Meals Preview Section - Below the form */}
            {meals.length > 0 && (
                <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
                    <div className="flex flex-col mx-auto mb-5 w-full">
                        <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-lg sm:text-xl uppercase text-center tracking-wide">
                            Aperçu des plats disponibles
                        </h3>
                        <div className="h-1 w-12 bg-luminous-gold mx-auto my-3" />
                        <p className="mx-auto text-luminous-text-secondary text-sm italic text-center mb-4">
                            Découvrez les plats que vous pourrez commander après avoir choisi votre table
                        </p>

                        {/* Meal type badges */}
                        <div className="flex flex-wrap justify-center gap-2 mx-auto mb-6">
                            {Object.values(OrderingDomainModel.MealType).map((type) => {
                                const count = meals.filter(m => m.type === type).length;
                                if (count === 0) return null;
                                return (
                                    <span
                                        key={type}
                                        className={`${mealBadgeStyles[type]} px-3 py-1 rounded-full font-medium text-sm`}
                                    >
                                        {count} {mealTypes[type]}{count > 1 ? 's' : ''}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Meals Grid */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="w-[140px] sm:w-[180px] md:w-[200px]"
                            >
                                <div className={`relative rounded-xl overflow-hidden border-2 ${mealBorder[meal.type]} bg-luminous-bg-card shadow-[0_4px_20px_rgba(201,162,39,0.08)] hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)] transition-shadow duration-300`}>
                                    {/* Meal type badge */}
                                    <span className={`absolute top-2 left-2 z-10 ${mealBadgeStyles[meal.type]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                                        {mealTypes[meal.type]}
                                    </span>

                                    {/* Meal image */}
                                    <Image
                                        width={200}
                                        height={200}
                                        src={meal.imageUrl}
                                        alt={meal.title}
                                        className="w-full h-[120px] sm:h-[150px] md:h-[180px] object-cover"
                                    />

                                    {/* Meal info */}
                                    <div className="p-3 bg-luminous-bg-card">
                                        <h4 className="text-sm font-medium text-luminous-text-primary text-center truncate">
                                            {meal.title}
                                        </h4>
                                        <p className="text-sm font-semibold text-luminous-gold text-center mt-1">
                                            {meal.price} €
                                        </p>
                                        {meal.requiredAge && (
                                            <p className="text-xs text-luminous-rose text-center mt-1">
                                                {meal.requiredAge}+ ans requis
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </LuminousCard>
            )}
        </div>
    );
}


const GuestRows: React.FC<{
    id: string | number,
    firstName: string,
    lastName: string,
    age: number,
    isOrganizer: boolean,
    onChange: <T extends keyof OrderingDomainModel.Guest>
        (id:string | number,
        key:T,
        value: OrderingDomainModel.Guest[T]
        ) => void,
    remove: (id:string | number) => void,
    changeOrganizer: (id:string | number) => void
    checkboxRef: any
}> = ({id, onChange, remove, changeOrganizer, isOrganizer, checkboxRef}) => {

    return (
    <div className="flex md:flex-row flex-col justify-center gap-3 mx-auto my-5 p-4 bg-luminous-bg-secondary rounded-lg border border-luminous-gold-border">

            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-luminous-gold-muted text-xs uppercase tracking-wider mb-1">Prénom</span>
                        <input type="text"
                        id="firstName"
                        placeholder="Andrew"
                        className="block border-luminous-gold-border focus:border-luminous-gold bg-luminous-bg-card mt-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-luminous-gold/30 w-full text-sm text-luminous-text-primary placeholder-luminous-text-muted focus:outline-none transition-all duration-200"
                        onChange= {(e) => onChange(id, 'firstName', e.target.value)}
                        />
                </label>
            </div>

            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-luminous-gold-muted text-xs uppercase tracking-wider mb-1">Nom</span>
                        <input type="text"
                        id="lastName"
                        placeholder="Collins"
                        className="block border-luminous-gold-border focus:border-luminous-gold bg-luminous-bg-card mt-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-luminous-gold/30 w-full text-sm text-luminous-text-primary placeholder-luminous-text-muted focus:outline-none transition-all duration-200"
                        min="0"
                        onChange= {(e) => onChange(id, "lastName", e.target.value)}
                        />
                </label>
            </div>

            <div className="relative flex flex-col justify-center items-center">
                <label className="block">
                    <span className="block font-medium text-luminous-gold-muted text-xs uppercase tracking-wider mb-1">Âge</span>
                        <input type="number"
                        id="age"
                        placeholder="25"
                        className="block border-luminous-gold-border focus:border-luminous-gold bg-luminous-bg-card mt-1 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-luminous-gold/30 w-full md:max-w-[80px] text-sm text-luminous-text-primary placeholder-luminous-text-muted focus:outline-none transition-all duration-200"
                        min="0"
                        onChange= {(e) => onChange(id, "age", parseInt(e.target.value))}
                        />
                </label>
            </div>

            <div className="relative md:flex flex-col justify-end items-center hidden">
                <button
                    className="flex items-center justify-center bg-luminous-bg-card border border-luminous-rose/30 hover:border-luminous-rose hover:bg-luminous-rose/10 mb-1 ml-5 p-2 rounded-lg transition-all duration-200 group"
                    onClick={() => remove(id)}
                >
                    <Trash2 className="w-4 h-4 text-luminous-rose" />
                </button>
            </div>
            <div className="relative md:flex flex-col justify-end items-center hidden">
                <span className="text-luminous-gold-muted text-xs uppercase tracking-wider mb-1">Organisateur</span>
                <div className="mt-1">
                    <Checkbox.Root
                        defaultChecked={isOrganizer}
                        onCheckedChange={() => changeOrganizer(id)}
                        ref={checkboxRef}
                        className="bg-luminous-bg-card border-2 border-luminous-gold-border rounded-lg w-7 h-7 flex items-center justify-center data-[state=checked]:bg-luminous-gold data-[state=checked]:border-luminous-gold hover:border-luminous-gold transition-all duration-200"
                    >
                        <Checkbox.Indicator>
                            <Check className="w-4 h-4 text-white" />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
             </div>

            <div className="flex justify-between items-center md:hidden mx-auto w-full max-w-[220px] mt-2">
                <div className="relative flex flex-col justify-end items-center">
                    <button
                        className="flex items-center justify-center bg-luminous-bg-card border border-luminous-rose/30 hover:border-luminous-rose hover:bg-luminous-rose/10 p-2 rounded-lg transition-all duration-200"
                        onClick={() => remove(id)}
                    >
                        <Trash2 className="w-4 h-4 text-luminous-rose" />
                    </button>
                </div>
                <div className="flex justify-end items-center gap-2">
                    <span className="text-luminous-gold-muted text-xs uppercase tracking-wider">J&#39;organise</span>
                    <Checkbox.Root
                        defaultChecked={isOrganizer}
                        onCheckedChange={() => changeOrganizer(id)}
                        ref={checkboxRef}
                        className="bg-luminous-bg-card border-2 border-luminous-gold-border rounded-lg w-7 h-7 flex items-center justify-center data-[state=checked]:bg-luminous-gold data-[state=checked]:border-luminous-gold hover:border-luminous-gold transition-all duration-200"
                    >
                        <Checkbox.Indicator>
                            <Check className="w-4 h-4 text-white" />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
            </div>
    </div>
    )
}
