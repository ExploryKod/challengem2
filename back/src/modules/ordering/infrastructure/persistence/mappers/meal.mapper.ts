import { Meal } from '../../../domain/entities/meal.entity';
import { MealOrmEntity } from '../orm-entities/meal.orm-entity';

export class MealMapper {
  static toDomain(ormEntity: MealOrmEntity): Meal {
    const meal = new Meal();
    meal.id = ormEntity.id;
    meal.restaurantId = ormEntity.restaurantId;
    meal.title = ormEntity.title;
    meal.type = ormEntity.type;
    meal.price = Number(ormEntity.price);
    meal.requiredAge = ormEntity.requiredAge;
    meal.imageUrl = ormEntity.imageUrl;
    return meal;
  }

  static toOrm(domain: Meal): MealOrmEntity {
    const ormEntity = new MealOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.restaurantId = domain.restaurantId;
    ormEntity.title = domain.title;
    ormEntity.type = domain.type;
    ormEntity.price = domain.price;
    ormEntity.requiredAge = domain.requiredAge;
    ormEntity.imageUrl = domain.imageUrl;
    return ormEntity;
  }
}
