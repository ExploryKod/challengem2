"use client";
import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { useMealsPreview } from './use-meals-preview.hook';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';

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

  const groupedMeals = {
    [OrderingDomainModel.MealType.ENTRY]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.ENTRY),
    [OrderingDomainModel.MealType.MAIN_COURSE]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.MAIN_COURSE),
    [OrderingDomainModel.MealType.DESSERT]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DESSERT),
    [OrderingDomainModel.MealType.DRINK]: presenter.meals.filter(m => m.type === OrderingDomainModel.MealType.DRINK),
  };

  return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down">
      <div className="flex flex-col mx-auto mb-5 w-full">
        <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl uppercase text-center tracking-wide">
          Découvrez notre carte
        </h3>
        {presenter.restaurantName && (
          <p className="text-center text-luminous-gold text-sm sm:text-base mb-2">
            {presenter.restaurantName}
          </p>
        )}
        <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
        <p className="mx-auto text-luminous-text-secondary text-sm italic text-center mb-4 max-w-[600px]">
          Parcourez les plats disponibles avant de réserver votre table
        </p>
      </div>

      {/* Meals by category */}
      <div className="flex flex-col gap-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const mealsOfType = groupedMeals[type];
          if (mealsOfType.length === 0) return null;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {mealsOfType.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex-shrink-0 w-[140px] sm:w-[180px] snap-start"
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
                        className="w-full h-[120px] sm:h-[150px] object-cover"
                      />

                      {/* Meal info */}
                      <div className="p-3 bg-luminous-bg-card">
                        <h5 className="text-sm font-medium text-luminous-text-primary text-center truncate">
                          {meal.title}
                        </h5>
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
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
        <LuminousButton
          onClick={presenter.onPrevious}
          variant="secondary"
        >
          Précédent
        </LuminousButton>
        <LuminousButton
          onClick={presenter.onContinue}
          variant="success"
        >
          Continuer
        </LuminousButton>
      </div>
    </LuminousCard>
  );
};
