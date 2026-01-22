"use client";
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { useMealsPreview } from './use-meals-preview.hook';

export interface MealsPreviewSectionProps {
  meals: OrderingDomainModel.Meal[];
  restaurantName: string;
}

export const MealsPreviewSection: React.FC<MealsPreviewSectionProps> = ({ meals, restaurantName }) => {
  const presenter = useMealsPreview({ meals, restaurantName });

  const mealTypes: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "Entrée",
    "MAIN_COURSE": "Plat",
    "DESSERT": "Dessert",
    "DRINK": "Boisson",
  };

  const mealBadgeStyles: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "bg-blue-100 text-blue-800",
    "MAIN_COURSE": "bg-gray-100 text-gray-800",
    "DESSERT": "bg-red-100 text-red-800",
    "DRINK": "bg-green-100 text-green-800",
  };

  const mealBorder: Record<OrderingDomainModel.MealType, string> = {
    "ENTRY": "border-blue-800",
    "MAIN_COURSE": "border-gray-800",
    "DESSERT": "border-red-800",
    "DRINK": "border-green-800",
  };

  const groupedMeals = {
    [OrderingDomainModel.MealType.ENTRY]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.ENTRY),
    [OrderingDomainModel.MealType.MAIN_COURSE]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.MAIN_COURSE),
    [OrderingDomainModel.MealType.DESSERT]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DESSERT),
    [OrderingDomainModel.MealType.DRINK]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DRINK),
  };

  return (
    <section className="bg-luxury-bg-card shadow-[0_8px_9px_-4px_rgba(212,175,55,0.2),0_4px_18px_0_rgba(212,175,55,0.1)] mx-auto py-8 sm:py-12 rounded w-full max-w-[1200px] animate-fade-in-down px-4 sm:px-6">
      <div className="flex flex-col mx-auto mb-5 w-full">
        <h3 className="mx-auto my-3 font-display font-medium text-luxury-text-primary text-xl sm:text-2xl uppercase text-center tracking-wide">
          Découvrez notre carte
        </h3>
        {presenter.restaurantName && (
          <p className="text-center text-luxury-gold text-sm sm:text-base mb-2">
            {presenter.restaurantName}
          </p>
        )}
        <div className="h-1 w-16 bg-luxury-gold mx-auto my-4" />
        <p className="mx-auto text-luxury-text-secondary text-sm italic text-center mb-4 max-w-[600px]">
          Parcourez les plats disponibles avant de réserver votre table
        </p>
      </div>

      {/* Meals by category */}
      <div className="flex flex-col gap-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const meals = groupedMeals[type];
          if (meals.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luxury-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex-shrink-0 w-[140px] sm:w-[180px] snap-start"
                  >
                    <div className={`relative rounded-xl overflow-hidden border-2 ${mealBorder[meal.type]} bg-luxury-bg-primary shadow-[0_4px_20px_rgba(212,175,55,0.08)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] transition-shadow duration-300`}>
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
                        className="w-full h-[120px] sm:h-[150px] object-cover"
                      />

                      {/* Meal info */}
                      <div className="p-3 bg-luxury-bg-card">
                        <h5 className="text-sm font-medium text-luxury-text-primary text-center truncate">
                          {meal.title}
                        </h5>
                        <p className="text-sm font-semibold text-luxury-gold text-center mt-1">
                          {meal.price} €
                        </p>
                        {meal.requiredAge && (
                          <p className="text-xs text-luxury-rose text-center mt-1">
                            {meal.requiredAge}+ ans requis
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
        <button
          onClick={presenter.onPrevious}
          type="button"
          className="inline-block bg-luxury-bg-secondary hover:bg-luxury-bg-primary border-2 border-luxury-gold-border hover:border-luxury-gold-muted shadow-[0_4px_9px_-4px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_9px_-4px_rgba(212,175,55,0.3),0_4px_18px_0_rgba(212,175,55,0.2)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-luxury-text-primary text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none"
        >
          Précédent
        </button>
        <button
          onClick={presenter.onContinue}
          type="button"
          className="inline-block bg-luxury-gold hover:bg-luxury-gold-muted shadow-[0_4px_9px_-4px_rgba(212,175,55,0.5)] hover:shadow-[0_8px_9px_-4px_rgba(212,175,55,0.3),0_4px_18px_0_rgba(212,175,55,0.2)] px-4 sm:px-6 pt-2.5 pb-2 rounded focus:ring-0 font-medium text-luxury-bg-primary text-xs uppercase leading-normal transition duration-150 ease-in-out focus:outline-none"
        >
          Continuer
        </button>
      </div>
    </section>
  );
};
