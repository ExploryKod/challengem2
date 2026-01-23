import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IAdminRestaurantRepository } from '../../../application/ports/admin-restaurant.repository.port';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';
import { RestaurantOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/restaurant.orm-entity';
import { TableOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { MealOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { ReservationOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';
import { RestaurantMapper } from '../../../../ordering/infrastructure/persistence/mappers/restaurant.mapper';

@Injectable()
export class AdminRestaurantRepository implements IAdminRestaurantRepository {
  constructor(
    @InjectRepository(RestaurantOrmEntity)
    private readonly restaurantRepository: Repository<RestaurantOrmEntity>,
    @InjectRepository(TableOrmEntity)
    private readonly tableRepository: Repository<TableOrmEntity>,
    @InjectRepository(MealOrmEntity)
    private readonly mealRepository: Repository<MealOrmEntity>,
    @InjectRepository(ReservationOrmEntity)
    private readonly reservationRepository: Repository<ReservationOrmEntity>,
    @InjectRepository(GuestOrmEntity)
    private readonly guestRepository: Repository<GuestOrmEntity>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    const entities = await this.restaurantRepository
      .createQueryBuilder('restaurant')
      .loadRelationCountAndMap('restaurant.tableCount', 'restaurant.tables')
      .loadRelationCountAndMap('restaurant.mealCount', 'restaurant.meals')
      .getMany();
    return entities.map((entity) => {
      const restaurant = RestaurantMapper.toDomain(entity);
      restaurant.tableCount = (entity as any).tableCount ?? 0;
      restaurant.mealCount = (entity as any).mealCount ?? 0;
      return restaurant;
    });
  }

  async findById(id: number): Promise<Restaurant | null> {
    const entity = await this.restaurantRepository.findOne({ where: { id } });
    return entity ? RestaurantMapper.toDomain(entity) : null;
  }

  async create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
    const ormEntity = new RestaurantOrmEntity();
    ormEntity.name = data.name;
    ormEntity.type = data.type;
    ormEntity.stars = data.stars;
    const saved = await this.restaurantRepository.save(ormEntity);
    return RestaurantMapper.toDomain(saved);
  }

  async update(
    id: number,
    data: Partial<Omit<Restaurant, 'id'>>,
  ): Promise<Restaurant | null> {
    const existing = await this.restaurantRepository.findOne({ where: { id } });
    if (!existing) return null;

    if (data.name !== undefined) existing.name = data.name;
    if (data.type !== undefined) existing.type = data.type;
    if (data.stars !== undefined) existing.stars = data.stars;

    const saved = await this.restaurantRepository.save(existing);
    return RestaurantMapper.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    // Cascade delete: delete related entities in the correct order
    // 1. Find all reservations for this restaurant and delete their guests
    const reservations = await this.reservationRepository.find({
      where: { restaurantId: id },
    });
    for (const reservation of reservations) {
      await this.guestRepository.delete({ reservationId: reservation.id });
    }

    // 2. Delete reservations for this restaurant
    await this.reservationRepository.delete({ restaurantId: id });

    // 3. Delete tables for this restaurant
    await this.tableRepository.delete({ restaurantId: id });

    // 4. Delete meals for this restaurant
    await this.mealRepository.delete({ restaurantId: id });

    // 5. Finally delete the restaurant
    const result = await this.restaurantRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
