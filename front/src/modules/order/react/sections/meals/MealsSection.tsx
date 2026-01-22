import React, { useEffect, useState } from "react";
import {OrderingDomainModel} from '@taotask/modules/order/core/model/ordering.domain-model';
import Image  from 'next/image'
import { useMeals } from '@taotask/modules/order/react/sections/meals/use-meals.hook';
import  Carousel  from '@taotask/modules/order/react/components/carousel/Carousel';
import ImageContainer from "../../components/containers/ImageContainer";
import { MealCards } from './MealCards';

export const MealsSection = () => {
    const presenter = useMeals()

    console.log(presenter.guests)

    return (<>
      <section className="bg-[rgba(236,253,245,0.4)] hover:bg-[rgba(236,253,245,0.6)] shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] mx-auto py-8 sm:py-[50px] rounded w-full max-w-[1200px] animate-fade-in-down px-4 sm:px-6">
        <div className="flex flex-col mx-auto mb-5 w-full">
            <h3 className="mx-auto my-3 font-bold text-[#854854] text-base sm:text-lg uppercase text-center">Commandes des plats</h3>  
            <div className="flex flex-col sm:flex-row justify-center items-center bg-orange-200 mx-auto my-3 p-4 sm:p-5 rounded rounded max-w-[700px] gap-4 sm:gap-0">
                <Image src="/waiter.svg" height={150} width={150} alt="waiter" className="sm:h-[200px] sm:w-[200px] h-[150px] w-[150px]" />
                <div className="px-2">
                    <p className="mx-auto text-left text-sm sm:text-md text-red-900 italic">
                    Vous ne pouvez choisir qu&#39;un plat de chaque type par personne.</p>
                    <p className="mx-auto mt-2 text-left text-sm sm:text-md text-red-900 italic">Par exemple pour prendre <span className="font-bold">plusieurs entrées</span>, 
                    revenez en arrière et créer un second invité 
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
            />))}
           
       </div>

       <div className="flex flex-col sm:flex-row justify-center gap-2 mx-auto mt-8 lg:mt-[150px] w-full">
            <button
            onClick={presenter.onPrevious}
            type="button"
            className="inline-block bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Précèdent
            </button>
            <button
            onClick={presenter.onSkip}
            type="button"
            className="inline-block bg-orange-500 hover:bg-orange-600 focus:bg-orange-600 active:bg-orange-700 shadow-[0_4px_9px_-4px_#f97316] hover:shadow-[0_8px_9px_-4px_rgba(249,115,22,0.3),0_4px_18px_0_rgba(249,115,22,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(249,115,22,0.3),0_4px_18px_0_rgba(249,115,22,0.2)] active:shadow-[0_8px_9px_-4px_rgba(249,115,22,0.3),0_4px_18px_0_rgba(249,115,22,0.2)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Passer les commandes
            </button>
            <button
            onClick={presenter.onNext}
            type="button"
            className="inline-block disabled:border-gray-200 bg-[#458236] hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-700 disabled:bg-gray-500 shadow-[0_4px_9px_-4px_#3b71ca] hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] disabled:shadow-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-white text-xs disabled:text-gray-50 uppercase leading-normal transition duration-150 ease-in-out focus:outline-none">
            Suivant
            </button>
        </div>
    </section>
    </>)

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
    entries,
    mainCourses,
    desserts,
    drinks,
    onMealSelected,
    onEntrySelected,
    onMainCourseSelected,
    onDessertSelected,
    onDrinkSelected,
}) => {


    const mealBorder = {
        "ENTRY": "border-2 border border-blue-800",
        "MAIN_COURSE": "border-2 border border-gray-800",
        "DESSERT": "border-2 border border-red-800",
        "DRINK": "border-2 border border-green-800",
    }

    const mealStyles = {
        "ENTRY": "bg-blue-100 border-2 border border-blue-800 text-blue-800",
        "MAIN_COURSE": "bg-gray-100 border-2 border border-gray-800 text-gray-800",
        "DESSERT": "bg-red-100 border-2 border border-red-800 text-red-800",
        "DRINK": "bg-green-100 border-2 border border-green-800 text-green-800",
    }

    const mealColors = {
        "ENTRY": "blue",
        "MAIN_COURSE": "gray",
        "DESSERT": "red",
        "DRINK": "green",
    }


    const mealTypes = {
        "ENTRY": "Entrée",
        "MAIN_COURSE": "Plat",
        "DESSERT": "Dessert",
        "DRINK": "Boisson",
    }

    if(!guest) {
        return null;
    }

    return (<>

        <div className="flex flex-col mx-auto mb-5 p-3 sm:p-5 w-full max-w-[400px] sm:max-w-[700px] lg:max-w-[1024px] xl:max-w-[1200px]">
            <div className="border-[#458236] border-2 mx-auto p-3 border rounded w-full">
                <h4 className="mx-auto font-bold text-center text-base sm:text-lg text-orange-900">Choix de {firstName} {lastName}</h4>
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-5 mx-auto p-3">
                    <span className="bg-blue-100 px-2 sm:px-2.5 py-0.5 rounded font-medium text-blue-800 text-xs sm:text-sm">Entrées</span>
                    <span className="bg-gray-100 px-2 sm:px-2.5 py-0.5 rounded font-medium text-gray-800 text-xs sm:text-sm">Plats</span>
                    <span className="bg-red-100 px-2 sm:px-2.5 py-0.5 rounded font-medium text-red-800 text-xs sm:text-sm">Desserts</span>
                    <span className="bg-green-100 px-2 sm:px-2.5 py-0.5 rounded font-medium text-green-800 text-xs sm:text-sm">Boissons</span>
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

        {/* Version desktop/tablette : Carousel (style original restauré) */}
        <div className="hidden sm:block w-full">
            <Carousel show={3}>
                {meals.filter(meal => 
                (meal.requiredAge === null || meal.requiredAge <= guest.age))
                .map((meal) => (
                  
                    <div key={meal.id} onClick={() => onMealSelected(guestId, meal.id, meal.type)} className={`
                    max-w-[300px] my-5 mx-auto flex items-center justify-center gap-2`} >
                       
                        <div className={`relative cursor-pointer group hover:opacity-90
                            my-5 mx-3 p-0 md:w-[200px] flex-wrap rounded`}>
                             <span className={`inline-block mb-4 bg-${mealColors[meal.type]}-100 px-2.5 py-0.5 rounded font-medium text-${mealColors[meal.type]}-800 text-sm`}>{mealTypes[meal.type]}</span>
                            <ImageContainer classNames="flex flex-col items-center justify-center">
                            <Image 
                                width={200}
                                height={200}
                                src={meal.imageUrl}
                                alt={meal.title}
                                className="group-hover:opacity-90 rounded md:w-[200px] md:h-[200px] object-cover"
                            />
                            </ImageContainer>

                            <div className={`flex flex-col rounded group-hover:opacity-90 justify-center items-center gap-3 mt-4 p-5 md:min-h-[100px] 
                            ${meal.type && (selectedEntryId === meal.id || 
                                            selectedDrinkId === meal.id || 
                                            selectedDessertId === meal.id || 
                                            selectedMainCourseId === meal.id) ? 
                                `${mealStyles[meal.type]}` : `bg-transparent border border-2 ${mealBorder[meal.type]}`}`}
                                >
                                <h3 className={`text-center text-sm font-bold`}>{meal.title}</h3>
                                <p className={`text-center text-sm font-bold`}>{meal.price} €</p>
                            </div>
                       
                        </div>
                    </div>
                  
                ))}
          </Carousel> 
        </div>
        </div>
    </>)
}




