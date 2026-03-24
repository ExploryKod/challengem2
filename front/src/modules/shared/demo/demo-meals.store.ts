export type DemoMeal = {
  id: number;
  restaurantId: number;
  title: string;
  type: 'ENTRY' | 'MAIN_COURSE' | 'DESSERT' | 'DRINK';
  price: number;
  requiredAge: number | null;
  imageUrl: string;
};

const createInitialDemoMeals = (): DemoMeal[] => [
  {
    id: -101,
    restaurantId: -1,
    title: 'Salade Provence',
    type: 'ENTRY',
    price: 8.5,
    requiredAge: null,
    imageUrl: '/entries/salade-olive-pexels-dana-tentis-118658-1213710.jpg',
  },
  {
    id: -105,
    restaurantId: -1,
    title: 'Tartine d ete',
    type: 'ENTRY',
    price: 7.5,
    requiredAge: null,
    imageUrl: '/entries/toast-oeuf-pexels-kyleroxas-2122294.jpg',
  },
  {
    id: -102,
    restaurantId: -1,
    title: 'Poulet roti',
    type: 'MAIN_COURSE',
    price: 18.0,
    requiredAge: null,
    imageUrl: '/mainCourses/poulet-pexels-karolina-grabowska-5718025.jpg',
  },
  {
    id: -106,
    restaurantId: -1,
    title: 'Fougasse du chef',
    type: 'MAIN_COURSE',
    price: 16.5,
    requiredAge: null,
    imageUrl: '/mainCourses/fougasse-pexels-nadin-sh-78971847-21753113.jpg',
  },
  {
    id: -103,
    restaurantId: -1,
    title: 'Tiramisu',
    type: 'DESSERT',
    price: 7.0,
    requiredAge: null,
    imageUrl: '/desserts/tiramisu-pexels-minche11-6880219.jpg',
  },
  {
    id: -107,
    restaurantId: -1,
    title: 'Mousse cacao',
    type: 'DESSERT',
    price: 6.5,
    requiredAge: null,
    imageUrl: '/desserts/tiramisu-pexels-minche11-6880219.jpg',
  },
  {
    id: -104,
    restaurantId: -1,
    title: 'Vin rouge',
    type: 'DRINK',
    price: 6.0,
    requiredAge: 18,
    imageUrl: '/drinks/wine-pexels-jill-burrow-6858660.jpg',
  },
  {
    id: -108,
    restaurantId: -1,
    title: 'Cocktail d ete',
    type: 'DRINK',
    price: 7.0,
    requiredAge: 18,
    imageUrl: '/drinks/coktail-pexels-ifreestock-616836.jpg',
  },
  {
    id: -201,
    restaurantId: -2,
    title: 'Veloute de saison',
    type: 'ENTRY',
    price: 9.0,
    requiredAge: null,
    imageUrl: '/entries/toast-oeuf-pexels-kyleroxas-2122294.jpg',
  },
  {
    id: -205,
    restaurantId: -2,
    title: 'Salade du jardin',
    type: 'ENTRY',
    price: 8.0,
    requiredAge: null,
    imageUrl: '/entries/salade-olive-pexels-dana-tentis-118658-1213710.jpg',
  },
  {
    id: -202,
    restaurantId: -2,
    title: 'Filet de boeuf',
    type: 'MAIN_COURSE',
    price: 26.0,
    requiredAge: null,
    imageUrl: '/mainCourses/salad-cream-pexels-julieaagaard-2097090.jpg',
  },
  {
    id: -206,
    restaurantId: -2,
    title: 'Poulet fermier',
    type: 'MAIN_COURSE',
    price: 21.0,
    requiredAge: null,
    imageUrl: '/mainCourses/poulet-pexels-karolina-grabowska-5718025.jpg',
  },
  {
    id: -203,
    restaurantId: -2,
    title: 'Creme brulee',
    type: 'DESSERT',
    price: 8.0,
    requiredAge: null,
    imageUrl: '/desserts/tiramisu-pexels-minche11-6880219.jpg',
  },
  {
    id: -207,
    restaurantId: -2,
    title: 'Douceur cafe',
    type: 'DESSERT',
    price: 7.0,
    requiredAge: null,
    imageUrl: '/desserts/tiramisu-pexels-minche11-6880219.jpg',
  },
  {
    id: -204,
    restaurantId: -2,
    title: 'Cocktail maison',
    type: 'DRINK',
    price: 7.5,
    requiredAge: 18,
    imageUrl: '/drinks/coktail-pexels-ifreestock-616836.jpg',
  },
  {
    id: -208,
    restaurantId: -2,
    title: 'Verre de rouge',
    type: 'DRINK',
    price: 6.5,
    requiredAge: 18,
    imageUrl: '/drinks/wine-pexels-jill-burrow-6858660.jpg',
  },
];

export class DemoMealsStore {
  private meals: DemoMeal[] = createInitialDemoMeals();

  listByRestaurantId(restaurantId: number): DemoMeal[] {
    return this.meals.filter((meal) => meal.restaurantId === restaurantId);
  }

  getById(id: number): DemoMeal | undefined {
    return this.meals.find((meal) => meal.id === id);
  }

  create(dto: {
    restaurantId: number;
    title: string;
    type: DemoMeal['type'];
    price: number;
    requiredAge?: number | null;
    imageUrl: string;
  }): DemoMeal {
    const nextId = this.nextDemoId();
    const meal: DemoMeal = {
      id: nextId,
      restaurantId: dto.restaurantId,
      title: dto.title,
      type: dto.type,
      price: dto.price,
      requiredAge: dto.requiredAge ?? null,
      imageUrl: dto.imageUrl,
    };
    this.meals = [meal, ...this.meals];
    return meal;
  }

  update(
    id: number,
    dto: Partial<{
      title: string;
      type: DemoMeal['type'];
      price: number;
      requiredAge: number | null;
      imageUrl: string;
    }>,
  ): DemoMeal {
    const meal = this.getById(id);
    if (!meal) {
      throw new Error('Demo meal not found');
    }
    const updated: DemoMeal = {
      ...meal,
      title: dto.title ?? meal.title,
      type: dto.type ?? meal.type,
      price: dto.price ?? meal.price,
      requiredAge: dto.requiredAge ?? meal.requiredAge,
      imageUrl: dto.imageUrl ?? meal.imageUrl,
    };
    this.meals = this.meals.map((item) => (item.id === id ? updated : item));
    return updated;
  }

  delete(id: number): void {
    this.meals = this.meals.filter((meal) => meal.id !== id);
  }

  private nextDemoId(): number {
    const minId = this.meals.reduce((min, meal) => Math.min(min, meal.id), -101);
    return minId - 1;
  }
}
