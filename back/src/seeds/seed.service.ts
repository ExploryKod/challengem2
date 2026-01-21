import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../modules/ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { MealType } from '../modules/ordering/domain/enums/meal-type.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(RestaurantOrmEntity)
    private readonly restaurantRepository: Repository<RestaurantOrmEntity>,
    @InjectRepository(TableOrmEntity)
    private readonly tableRepository: Repository<TableOrmEntity>,
    @InjectRepository(MealOrmEntity)
    private readonly mealRepository: Repository<MealOrmEntity>,
  ) {}

  async seed(): Promise<void> {
    const existingRestaurants = await this.restaurantRepository.count();
    if (existingRestaurants > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Create restaurant
    const restaurant = await this.restaurantRepository.save({
      name: 'Papilles des Suds',
      type: 'Méditerranéen',
      stars: 3,
    });

    console.log(`Created restaurant: ${restaurant.name}`);

    // Create tables
    const tables = await this.tableRepository.save([
      { restaurantId: restaurant.id, title: 'Table 1', capacity: 2 },
      { restaurantId: restaurant.id, title: 'Table 2', capacity: 4 },
      { restaurantId: restaurant.id, title: 'Table 3', capacity: 4 },
      { restaurantId: restaurant.id, title: 'Table 4', capacity: 6 },
      { restaurantId: restaurant.id, title: 'Table 5', capacity: 8 },
      { restaurantId: restaurant.id, title: 'Table 6', capacity: 10 },
    ]);

    console.log(`Created ${tables.length} tables`);

    // Create meals
    const meals = await this.mealRepository.save([
      // Entrées
      {
        restaurantId: restaurant.id,
        title: 'Salade César',
        type: MealType.ENTRY,
        price: 12.5,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: "Soupe à l'oignon",
        type: MealType.ENTRY,
        price: 9.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Bruschetta',
        type: MealType.ENTRY,
        price: 8.5,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Carpaccio de boeuf',
        type: MealType.ENTRY,
        price: 15.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1608877907149-a206d75ba011?w=400',
      },

      // Plats principaux
      {
        restaurantId: restaurant.id,
        title: 'Filet de boeuf',
        type: MealType.MAIN_COURSE,
        price: 28.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Saumon grillé',
        type: MealType.MAIN_COURSE,
        price: 24.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Risotto aux champignons',
        type: MealType.MAIN_COURSE,
        price: 19.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Poulet rôti',
        type: MealType.MAIN_COURSE,
        price: 18.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
      },

      // Desserts
      {
        restaurantId: restaurant.id,
        title: 'Tiramisu',
        type: MealType.DESSERT,
        price: 9.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Crème brûlée',
        type: MealType.DESSERT,
        price: 8.5,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Fondant au chocolat',
        type: MealType.DESSERT,
        price: 10.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Tarte aux fruits',
        type: MealType.DESSERT,
        price: 8.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      },

      // Boissons
      {
        restaurantId: restaurant.id,
        title: 'Eau minérale',
        type: MealType.DRINK,
        price: 4.0,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Coca-Cola',
        type: MealType.DRINK,
        price: 4.5,
        requiredAge: null,
        imageUrl:
          'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Vin rouge (verre)',
        type: MealType.DRINK,
        price: 7.0,
        requiredAge: 18,
        imageUrl:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
      },
      {
        restaurantId: restaurant.id,
        title: 'Bière artisanale',
        type: MealType.DRINK,
        price: 6.0,
        requiredAge: 18,
        imageUrl:
          'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
      },
    ]);

    console.log(`Created ${meals.length} meals`);
    console.log('Seeding completed!');
  }
}
