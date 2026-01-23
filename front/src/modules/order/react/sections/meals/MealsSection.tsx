import React from "react";
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import Image from 'next/image';
import { useMeals } from '@taotask/modules/order/react/sections/meals/use-meals.hook';
import { LuminousCard } from '@taotask/modules/order/react/components/ui/LuminousCard';
import { LuminousButton } from '@taotask/modules/order/react/components/ui/LuminousButton';
import { MealSelectionSummary } from '@taotask/modules/order/react/components/meals/MealSelectionSummary';
import { Check } from 'lucide-react';

export const MealsSection = () => {
  const presenter = useMeals();

  if (!presenter.currentGuest) {
    return null;
  }

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
    [OrderingDomainModel.MealType.ENTRY]: presenter.getSelectableEntries(presenter.currentGuest),
    [OrderingDomainModel.MealType.MAIN_COURSE]: presenter.getSelectableMainCourses(presenter.currentGuest),
    [OrderingDomainModel.MealType.DESSERT]: presenter.getSelectableDesserts(presenter.currentGuest),
    [OrderingDomainModel.MealType.DRINK]: presenter.getSelectableDrinks(presenter.currentGuest),
  };

  return (
    <LuminousCard className="mx-auto py-8 sm:py-12 w-full max-w-[1200px] animate-fade-in-down relative">
      <div className="flex flex-col mx-auto mb-5 w-full">
        <h3 className="mx-auto my-3 font-display font-medium text-luminous-text-primary text-xl sm:text-2xl text-center tracking-wide">
          Commande de {presenter.currentGuest.firstName} {presenter.currentGuest.lastName}
        </h3>
        <p className="text-center text-luminous-text-secondary text-sm mb-2">
          Invité {presenter.currentGuestIndex + 1}/{presenter.totalGuests}
        </p>
        <div className="h-1 w-16 bg-luminous-gold mx-auto my-4" />
      </div>

      {/* Vertical scroll sections for meal categories */}
      <div className="flex flex-col gap-8 mb-8">
        {Object.values(OrderingDomainModel.MealType).map((type) => {
          const meals = groupedMeals[type];
          if (meals.length === 0) return null;

          const selectedMealId =
            type === OrderingDomainModel.MealType.ENTRY ? presenter.currentGuest.meals.entry :
            type === OrderingDomainModel.MealType.MAIN_COURSE ? presenter.currentGuest.meals.mainCourse :
            type === OrderingDomainModel.MealType.DESSERT ? presenter.currentGuest.meals.dessert :
            presenter.currentGuest.meals.drink;

          return (
            <div key={type}>
              <h4 className="text-lg font-display font-medium text-luminous-text-primary mb-4 uppercase tracking-wide">
                {mealTypes[type]}s
              </h4>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {meals.map((meal) => {
                  const isSelected = selectedMealId === meal.id;
                  const isAgeRestricted = Boolean(
                    meal.requiredAge && meal.requiredAge > presenter.currentGuest.age
                  );

                  return (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => {
                        if (!isAgeRestricted) {
                          presenter.onMealSelected(String(presenter.currentGuest.id), meal.id, meal.type);
                        }
                      }}
                      aria-pressed={isSelected}
                      aria-disabled={isAgeRestricted}
                      disabled={isAgeRestricted}
                      className={`flex-shrink-0 w-[140px] sm:w-[180px] snap-start text-left ${isAgeRestricted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luminous-gold/60 rounded-xl`}
                    >
                      <div className={`relative rounded-xl overflow-hidden border-2 ${isSelected ? 'border-luminous-gold' : 'border-luminous-gold-border'} bg-luminous-bg-card shadow-[0_4px_20px_rgba(201,162,39,0.08)] hover:shadow-[0_8px_30px_rgba(201,162,39,0.12)] transition-all duration-300`}>
                        {/* Meal type badge */}
                        <span className={`absolute top-2 left-2 z-10 ${mealBadgeStyles[meal.type]} px-2 py-0.5 rounded-full text-xs font-medium`}>
                          {mealTypes[meal.type]}
                        </span>

                        {/* Selected checkmark */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-6 h-6 bg-luminous-sage rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" aria-hidden="true" />
                          </div>
                        )}

                        {/* Meal image */}
                        <Image
                          width={200}
                          height={200}
                          src={meal.imageUrl}
                          alt={meal.title}
                          className="w-full h-[120px] sm:h-[150px] object-cover"
                        />

                        {/* Meal info */}
                        <div className="p-3">
                          <h5 className="text-sm font-medium text-luminous-text-primary text-center truncate">
                            {meal.title}
                          </h5>
                          <p className="text-sm font-semibold text-luminous-gold text-center mt-1">
                            {meal.price} €
                          </p>
                          {meal.requiredAge && (
                            <p className={`text-xs text-center mt-1 ${isAgeRestricted ? 'text-luminous-rose' : 'text-luminous-text-muted'}`}>
                              {meal.requiredAge}+ ans requis
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      <MealSelectionSummary guest={presenter.currentGuest} meals={presenter.meals} />

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mx-auto w-full mt-8">
        {!presenter.isFirstGuest && (
          <LuminousButton
            onClick={presenter.onPreviousGuest}
            variant="secondary"
          >
            Invité précédent
          </LuminousButton>
        )}

        {presenter.currentGuestIndex === 0 && (
          <LuminousButton
            onClick={presenter.onPrevious}
            variant="secondary"
          >
            Précédent
          </LuminousButton>
        )}

        <LuminousButton
          onClick={presenter.onSkip}
          variant="destructive"
        >
          Passer les commandes
        </LuminousButton>

        {!presenter.isLastGuest ? (
          <LuminousButton
            onClick={presenter.onNextGuest}
            variant="success"
          >
            Invité suivant
          </LuminousButton>
        ) : (
          <LuminousButton
            onClick={presenter.onNext}
            variant="success"
          >
            Suivant
          </LuminousButton>
        )}
      </div>
    </LuminousCard>
  );
};
