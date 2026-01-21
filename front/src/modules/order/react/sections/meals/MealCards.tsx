import React from "react";
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import ImageContainer from "../../components/containers/ImageContainer";

export const MealCards: React.FC<{
    guestId: string,
    guest: OrderingDomainModel.Guest | null,
    meals: OrderingDomainModel.Meal[],
    selectedEntryId: string,
    selectedMainCourseId: string,
    selectedDessertId: string,
    selectedDrinkId: string,
    onMealSelected: (guestId: string, id: string, type: string) => void,
}> = ({
    guestId,
    guest,
    meals,
    selectedEntryId,
    selectedMainCourseId,
    selectedDessertId,
    selectedDrinkId,
    onMealSelected,
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

    if (!guest) {
        return null;
    }

    const filteredMeals = meals.filter(meal => 
        (meal.requiredAge === null || meal.requiredAge <= guest.age)
    );

    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {filteredMeals.map((meal) => (
                <div 
                    key={meal.id} 
                    onClick={() => onMealSelected(guestId, meal.id, meal.type)} 
                    className="cursor-pointer"
                >
                    <div className="relative cursor-pointer group hover:opacity-90 my-3 mx-auto p-0 w-full rounded">
                        <span className={`inline-block mb-4 bg-${mealColors[meal.type]}-100 px-2.5 py-0.5 rounded font-medium text-${mealColors[meal.type]}-800 text-sm`}>
                            {mealTypes[meal.type]}
                        </span>
                        <ImageContainer classNames="flex flex-col items-center justify-center">
                            <Image 
                                width={200}
                                height={200}
                                src={meal.imageUrl}
                                alt={meal.title}
                                className="group-hover:opacity-90 rounded w-full h-auto object-cover"
                            />
                        </ImageContainer>

                        <div className={`flex flex-col rounded group-hover:opacity-90 justify-center items-center gap-3 mt-4 p-5 min-h-[100px] 
                            ${meal.type && (selectedEntryId === meal.id || 
                                            selectedDrinkId === meal.id || 
                                            selectedDessertId === meal.id || 
                                            selectedMainCourseId === meal.id) ? 
                                `${mealStyles[meal.type]}` : `bg-transparent border border-2 ${mealBorder[meal.type]}`}`}
                        >
                            <h3 className="text-center text-sm font-bold">{meal.title}</h3>
                            <p className="text-center text-sm font-bold">{meal.price} €</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

