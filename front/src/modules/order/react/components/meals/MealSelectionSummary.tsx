import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';
import { Check, Minus } from 'lucide-react';

interface MealSelectionSummaryProps {
  guest: OrderingDomainModel.Guest;
  meals: OrderingDomainModel.Meal[];
}

export const MealSelectionSummary: React.FC<MealSelectionSummaryProps> = ({ guest, meals }) => {
  const getMealById = (id: string | null) => {
    if (!id) return null;
    return meals.find(m => m.id === id);
  };

  const entry = getMealById(guest.meals.entry?.mealId ?? null);
  const entryQty = guest.meals.entry?.quantity ?? 0;
  const mainCourse = getMealById(guest.meals.mainCourse?.mealId ?? null);
  const mainCourseQty = guest.meals.mainCourse?.quantity ?? 0;
  const dessert = getMealById(guest.meals.dessert?.mealId ?? null);
  const dessertQty = guest.meals.dessert?.quantity ?? 0;
  const drink = getMealById(guest.meals.drink?.mealId ?? null);
  const drinkQty = guest.meals.drink?.quantity ?? 0;

  return (
    <div className="sticky bottom-0 bg-luminous-bg-card border-t-2 border-luminous-gold-border p-4 rounded-t-xl shadow-lg">
      <p className="text-sm font-medium text-luminous-text-primary mb-2">
        {guest.firstName} {guest.lastName}
      </p>
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-entry font-medium">Entrée:</span>
          {entry ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">
                {entryQty > 1 ? `${entryQty}x ` : ''}{entry.title}
              </span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-main font-medium">Plat:</span>
          {mainCourse ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">
                {mainCourseQty > 1 ? `${mainCourseQty}x ` : ''}{mainCourse.title}
              </span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-dessert font-medium">Dessert:</span>
          {dessert ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">
                {dessertQty > 1 ? `${dessertQty}x ` : ''}{dessert.title}
              </span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-luminous-meal-drink font-medium">Boisson:</span>
          {drink ? (
            <>
              <Check className="w-3 h-3 text-luminous-sage" />
              <span className="text-luminous-text-secondary">
                {drinkQty > 1 ? `${drinkQty}x ` : ''}{drink.title}
              </span>
            </>
          ) : (
            <>
              <Minus className="w-3 h-3 text-luminous-text-muted" />
              <span className="text-luminous-text-muted">—</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
