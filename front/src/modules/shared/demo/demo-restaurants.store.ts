export type DemoRestaurant = {
  id: number;
  name: string;
  type: string;
  stars: number;
};

const DEMO_ID_THRESHOLD = 0;

const createInitialDemoRestaurants = (): DemoRestaurant[] => [
  { id: -1, name: 'Papilles des Suds (Demo)', type: 'Mediterraneen', stars: 3 },
  { id: -2, name: 'L\'Atelier du Ventoux (Demo)', type: 'Gastronomique', stars: 4 },
];

export const isDemoRestaurantId = (id: string | number): boolean => {
  if (typeof id === 'number') {
    return id < DEMO_ID_THRESHOLD;
  }
  const asNumber = Number(id);
  if (!Number.isNaN(asNumber)) {
    return asNumber < DEMO_ID_THRESHOLD;
  }
  return id.startsWith('demo-');
};

export class DemoRestaurantsStore {
  private restaurants: DemoRestaurant[] = createInitialDemoRestaurants();

  list(): DemoRestaurant[] {
    return [...this.restaurants];
  }

  getById(id: number): DemoRestaurant | undefined {
    return this.restaurants.find((restaurant) => restaurant.id === id);
  }

  create(dto: { name: string; type: string; stars: number }): DemoRestaurant {
    const nextId = this.nextDemoId();
    const restaurant: DemoRestaurant = {
      id: nextId,
      name: dto.name,
      type: dto.type,
      stars: dto.stars,
    };
    this.restaurants = [restaurant, ...this.restaurants];
    return restaurant;
  }

  update(id: number, dto: Partial<{ name: string; type: string; stars: number }>): DemoRestaurant {
    const restaurant = this.getById(id);
    if (!restaurant) {
      throw new Error('Demo restaurant not found');
    }
    const updated: DemoRestaurant = {
      ...restaurant,
      name: dto.name ?? restaurant.name,
      type: dto.type ?? restaurant.type,
      stars: dto.stars ?? restaurant.stars,
    };
    this.restaurants = this.restaurants.map((item) => (item.id === id ? updated : item));
    return updated;
  }

  delete(id: number): void {
    this.restaurants = this.restaurants.filter((restaurant) => restaurant.id !== id);
  }

  private nextDemoId(): number {
    const minId = this.restaurants.reduce((min, restaurant) => Math.min(min, restaurant.id), -1);
    return minId - 1;
  }
}
