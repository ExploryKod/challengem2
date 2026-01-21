import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IAdminMealRepository } from '../../../application/ports/admin-meal.repository.port';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';
import { MealOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/meal.orm-entity';
import { MealMapper } from '../../../../ordering/infrastructure/persistence/mappers/meal.mapper';

@Injectable()
export class AdminMealRepository implements IAdminMealRepository {
  constructor(
    @InjectRepository(MealOrmEntity)
    private readonly mealRepository: Repository<MealOrmEntity>,
  ) {}

  async findByRestaurantId(restaurantId: number): Promise<Meal[]> {
    const entities = await this.mealRepository.find({
      where: { restaurantId },
    });
    return entities.map((entity) => MealMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Meal | null> {
    const entity = await this.mealRepository.findOne({ where: { id } });
    return entity ? MealMapper.toDomain(entity) : null;
  }

  async create(data: Omit<Meal, 'id'>): Promise<Meal> {
    const ormEntity = new MealOrmEntity();
    ormEntity.restaurantId = data.restaurantId;
    ormEntity.title = data.title;
    ormEntity.type = data.type;
    ormEntity.price = data.price;
    ormEntity.requiredAge = data.requiredAge;
    ormEntity.imageUrl = data.imageUrl;
    const saved = await this.mealRepository.save(ormEntity);
    return MealMapper.toDomain(saved);
  }

  async update(
    id: number,
    data: Partial<Omit<Meal, 'id'>>,
  ): Promise<Meal | null> {
    const existing = await this.mealRepository.findOne({ where: { id } });
    if (!existing) return null;

    if (data.restaurantId !== undefined)
      existing.restaurantId = data.restaurantId;
    if (data.title !== undefined) existing.title = data.title;
    if (data.type !== undefined) existing.type = data.type;
    if (data.price !== undefined) existing.price = data.price;
    if (data.requiredAge !== undefined) existing.requiredAge = data.requiredAge;
    if (data.imageUrl !== undefined) existing.imageUrl = data.imageUrl;

    const saved = await this.mealRepository.save(existing);
    return MealMapper.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.mealRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
