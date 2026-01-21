import { Restaurant } from '../../../domain/entities/restaurant.entity';
import { RestaurantOrmEntity } from '../orm-entities/restaurant.orm-entity';

export class RestaurantMapper {
  static toDomain(ormEntity: RestaurantOrmEntity): Restaurant {
    const restaurant = new Restaurant();
    restaurant.id = ormEntity.id;
    restaurant.name = ormEntity.name;
    restaurant.type = ormEntity.type;
    restaurant.stars = ormEntity.stars;
    return restaurant;
  }

  static toOrm(domain: Restaurant): RestaurantOrmEntity {
    const ormEntity = new RestaurantOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.name = domain.name;
    ormEntity.type = domain.type;
    ormEntity.stars = domain.stars;
    return ormEntity;
  }
}
