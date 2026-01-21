import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ITableRepository } from '../../../application/ports/table.repository.port';
import { Table } from '../../../domain/entities/table.entity';
import { TableOrmEntity } from '../orm-entities/table.orm-entity';
import { TableMapper } from '../mappers/table.mapper';

@Injectable()
export class TableRepository implements ITableRepository {
  constructor(
    @InjectRepository(TableOrmEntity)
    private readonly repository: Repository<TableOrmEntity>,
  ) {}

  async findByRestaurantId(restaurantId: number): Promise<Table[]> {
    const entities = await this.repository.find({ where: { restaurantId } });
    return entities.map((entity) => TableMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Table | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TableMapper.toDomain(entity) : null;
  }
}
