import React from "react";
import {OrderingDomainModel} from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image'
import { useMeals } from '@taotask/modules/order/react/sections/meals/use-meals.hook';
import Carousel from '@taotask/modules/order/react/components/carousel/Carousel';
import ImageContainer from "../../components/containers/ImageContainer";
import { MealCards } from './MealCards';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

export const MealsSection = () => {
    const presenter = useMeals()

    return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
        <div className="flex flex-col mx-auto mb-5 w-full">
            <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl uppercase text-center tracking-wide">
                Commandes des plats
            </h3>
            <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />

            <div className="flex flex-col sm:flex-row justify-center items-center bg-luminous-bg-secondary border border-luminous-gold-border mx-auto my-3 p-4 sm:p-5 rounded-xl max-w-[700px] gap-4 sm:gap-0">
                <Image src="/waiter.svg" height={150} width={150} alt="waiter" className="sm:h-[200px] sm:w-[200px] h-[150px] w-[150px]" />
                <div className="px-2">
                    <p className="mx-auto text-left text-sm sm:text-base text-luminous-text-secondary italic">
                    Vous ne pouvez choisir qu&#39;un plat de chaque type par personne.</p>
                    <p className="mx-auto mt-2 text-left text-sm sm:text-base text-luminous-text-secondary italic">Par exemple pour prendre <span className="font-semibold text-luminous-gold">plusieurs entrées</span>,
                    revenez en arrière et créez un second invité
                    avec les mêmes prénom et nom que celui désireux de prendre plusieurs entrées.</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col mx-auto mb-5 w-full">
            {presenter.guests.map((guest:any) => (
                <MealComposer
                    key={guest.id}
                    guestId={guest.id}
                    guest={presenter.guests.find(g => g.id === guest.id) || null}
                    firstName={guest.firstName}
                    lastName={guest.lastName}
                    selectedEntryId={guest.meals.entry}
                    selectedMainCourseId={guest.meals.mainCourse}
                    selectedDessertId={guest.meals.dessert}
                    selectedDrinkId={guest.meals.drink}
                    meals={presenter.meals}
                    entries={presenter.getSelectableEntries(guest.id)}
                    mainCourses={presenter.getSelectableMainCourses(guest.id)}
                    desserts={presenter.getSelectableDesserts(guest.id)}
                    drinks={presenter.getSelectableDrinks(guest.id)}
                    onMealSelected={presenter.assignMeals}
                    onEntrySelected={presenter.assignEntry}
                    onMainCourseSelected={presenter.assignMainCourse}
                    onDessertSelected={presenter.assignDessert}
                    onDrinkSelected={presenter.assignDrink}
                />
            ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto mt-8 lg:mt-[100px] w-full">
            <LuminousButton
                onClick={presenter.onPrevious}
                variant="secondary"
            >
                Précédent
            </LuminousButton>
            <LuminousButton
                onClick={presenter.onSkip}
                variant="destructive"
            >
                Passer les commandes
            </LuminousButton>
            <LuminousButton
                onClick={presenter.onNext}
                variant="success"
            >
                Suivant
            </LuminousButton>
        </div>
    </LuminousCard>
    )
}

export const MealComposer: React.FC<{
    guestId: string,
    guest: OrderingDomainModel.Guest | null,
    firstName: string,
    lastName: string,
    selectedEntryId: string,
    selectedMainCourseId: string,
    selectedDessertId: string,
    selectedDrinkId: string,
    meals: OrderingDomainModel.Meal[],
    entries: OrderingDomainModel.Meal[],
    mainCourses: OrderingDomainModel.Meal[],
    desserts: OrderingDomainModel.Meal[],
    drinks: OrderingDomainModel.Meal[],
    onMealSelected: (guestId: string, id: string, type: string) => void,
    onEntrySelected: (guestId:string, id: string) => void,
    onMainCourseSelected: (guestId:string, id: string) => void,
    onDessertSelected: (guestId:string, id: string) => void,
    onDrinkSelected: (guestId:string, id: string) => void,
}> = ({
    guestId,
    guest,
    firstName,
    lastName,
    selectedEntryId,
    selectedMainCourseId,
    selectedDessertId,
    selectedDrinkId,
    meals,
    onMealSelected,
}) => {

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

    const mealTypes: Record<OrderingDomainModel.MealType, string> = {
        "ENTRY": "Entrée",
        "MAIN_COURSE": "Plat",
        "DESSERT": "Dessert",
        "DRINK": "Boisson",
    };

    if(!guest) {
        return null;
    }

    return (
    <>
        <div className="flex flex-col mx-auto mb-5 p-3 sm:p-5 w-full max-w-[400px] sm:max-w-[700px] lg:max-w-[1024px] xl:max-w-[1200px]">
            <div className="border-luminous-gold border-2 mx-auto p-4 rounded-xl w-full bg-luminous-bg-secondary">
                <h4 className="mx-auto font-display font-medium text-center text-lg sm:text-xl text-luminous-text-primary">
                    Choix de {firstName} {lastName}
                </h4>
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mx-auto p-3">
                    <span className="bg-luminous-meal-entry-bg px-3 py-1 rounded-full font-medium text-luminous-meal-entry text-xs sm:text-sm">Entrées</span>
                    <span className="bg-luminous-meal-main-bg px-3 py-1 rounded-full font-medium text-luminous-meal-main text-xs sm:text-sm">Plats</span>
                    <span className="bg-luminous-meal-dessert-bg px-3 py-1 rounded-full font-medium text-luminous-meal-dessert text-xs sm:text-sm">Desserts</span>
                    <span className="bg-luminous-meal-drink-bg px-3 py-1 rounded-full font-medium text-luminous-meal-drink text-xs sm:text-sm">Boissons</span>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap mx-auto mb-5 w-full max-w-[400px] sm:max-w-[700px] lg:max-w-[1024px] xl:max-w-[1200px] px-2">

            {/* Version mobile : Cards */}
            <div className="sm:hidden w-full">
                <MealCards
                    guestId={guestId}
                    guest={guest}
                    meals={meals}
                    selectedEntryId={selectedEntryId}
                    selectedMainCourseId={selectedMainCourseId}
                    selectedDessertId={selectedDessertId}
                    selectedDrinkId={selectedDrinkId}
                    onMealSelected={onMealSelected}
                />
            </div>

            {/* Version desktop/tablette : Carousel */}
            <div className="hidden sm:block w-full">
                <Carousel show={3}>
                    {meals.filter(meal =>
                        (meal.requiredAge === null || meal.requiredAge <= guest.age))
                    .map((meal) => (
                        <div key={meal.id} onClick={() => onMealSelected(guestId, meal.id, meal.type)} className="max-w-[300px] my-5 mx-auto flex items-center justify-center gap-2">
                            <div className="relative cursor-pointer group hover:opacity-90 my-5 mx-3 p-0 md:w-[200px] flex-wrap rounded-xl">
                                <span className={`inline-block mb-4 ${mealBadgeStyles[meal.type]} px-3 py-1 rounded-full font-medium text-sm`}>
                                    {mealTypes[meal.type]}
                                </span>
                                <ImageContainer classNames="flex flex-col items-center justify-center">
                                    <Image
                                        width={200}
                                        height={200}
                                        src={meal.imageUrl}
                                        alt={meal.title}
                                        className="group-hover:opacity-90 rounded-xl md:w-[200px] md:h-[200px] object-cover"
                                    />
                                </ImageContainer>

                                <div className={`flex flex-col rounded-xl group-hover:opacity-90 justify-center items-center gap-3 mt-4 p-5 md:min-h-[100px] border-2 transition-all duration-200
                                    ${meal.type && (selectedEntryId === meal.id ||
                                                    selectedDrinkId === meal.id ||
                                                    selectedDessertId === meal.id ||
                                                    selectedMainCourseId === meal.id)
                                        ? `${mealBadgeStyles[meal.type]} ${mealBorder[meal.type]}`
                                        : `bg-luminous-bg-card ${mealBorder[meal.type]} border-opacity-30`
                                    }`}
                                >
                                    <h3 className="text-center text-sm font-medium text-luminous-text-primary">{meal.title}</h3>
                                    <p className="text-center text-sm font-semibold text-luminous-gold">{meal.price} €</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    </>
    )
}
