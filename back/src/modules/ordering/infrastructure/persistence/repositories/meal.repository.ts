import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import type {
  IMealRepository,
  MealFilters,
} from '../../../application/ports/meal.repository.port';
import { Meal } from '../../../domain/entities/meal.entity';
import { MealOrmEntity } from '../orm-entities/meal.orm-entity';
import { MealMapper } from '../mappers/meal.mapper';

@Injectable()
export class MealRepository implements IMealRepository {
  constructor(
    @InjectRepository(MealOrmEntity)
    private readonly repository: Repository<MealOrmEntity>,
  ) {}

  async findByFilters(filters: MealFilters): Promise<Meal[]> {
    const where: Record<string, unknown> = {
      restaurantId: filters.restaurantId,
    };
    if (filters.type) {
      where.type = filters.type;
    }
    const entities = await this.repository.find({ where });
    return entities.map((entity) => MealMapper.toDomain(entity));
  }

  async findByIds(ids: number[]): Promise<Meal[]> {
    if (ids.length === 0) {
      return [];
    }
    const entities = await this.repository.find({
      where: { id: In(ids) },
    });
    return entities.map((entity) => MealMapper.toDomain(entity));
  }
}
