import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IRestaurantRepository } from '../../../application/ports/restaurant.repository.port';
import { Restaurant } from '../../../domain/entities/restaurant.entity';
import { RestaurantOrmEntity } from '../orm-entities/restaurant.orm-entity';
import { RestaurantMapper } from '../mappers/restaurant.mapper';

@Injectable()
export class RestaurantRepository implements IRestaurantRepository {
  constructor(
    @InjectRepository(RestaurantOrmEntity)
    private readonly repository: Repository<RestaurantOrmEntity>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    const entities = await this.repository
      .createQueryBuilder('restaurant')
      .innerJoin('restaurant.tables', 'table')
      .innerJoin('restaurant.meals', 'meal')
      .groupBy('restaurant.id')
      .getMany();
    return entities.map((entity) => RestaurantMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Restaurant | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? RestaurantMapper.toDomain(entity) : null;
  }
}
