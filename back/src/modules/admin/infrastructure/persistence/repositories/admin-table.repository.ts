import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IAdminTableRepository } from '../../../application/ports/admin-table.repository.port';
import { Table } from '../../../../ordering/domain/entities/table.entity';
import { TableOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/table.orm-entity';
import { ReservationOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';
import { TableMapper } from '../../../../ordering/infrastructure/persistence/mappers/table.mapper';

@Injectable()
export class AdminTableRepository implements IAdminTableRepository {
  constructor(
    @InjectRepository(TableOrmEntity)
    private readonly tableRepository: Repository<TableOrmEntity>,
    @InjectRepository(ReservationOrmEntity)
    private readonly reservationRepository: Repository<ReservationOrmEntity>,
    @InjectRepository(GuestOrmEntity)
    private readonly guestRepository: Repository<GuestOrmEntity>,
  ) {}

  async findByRestaurantId(restaurantId: number): Promise<Table[]> {
    const entities = await this.tableRepository.find({
      where: { restaurantId },
    });
    return entities.map((entity) => TableMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Table | null> {
    const entity = await this.tableRepository.findOne({ where: { id } });
    return entity ? TableMapper.toDomain(entity) : null;
  }

  async create(data: Omit<Table, 'id'>): Promise<Table> {
    const ormEntity = new TableOrmEntity();
    ormEntity.restaurantId = data.restaurantId;
    ormEntity.title = data.title;
    ormEntity.capacity = data.capacity;
    const saved = await this.tableRepository.save(ormEntity);
    return TableMapper.toDomain(saved);
  }

  async update(
    id: number,
    data: Partial<Omit<Table, 'id'>>,
  ): Promise<Table | null> {
    const existing = await this.tableRepository.findOne({ where: { id } });
    if (!existing) return null;

    if (data.restaurantId !== undefined)
      existing.restaurantId = data.restaurantId;
    if (data.title !== undefined) existing.title = data.title;
    if (data.capacity !== undefined) existing.capacity = data.capacity;

    const saved = await this.tableRepository.save(existing);
    return TableMapper.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    // Cascade delete: delete reservations and their guests for this table
    const reservations = await this.reservationRepository.find({
      where: { tableId: id },
    });
    for (const reservation of reservations) {
      await this.guestRepository.delete({ reservationId: reservation.id });
    }

    // Delete reservations for this table
    await this.reservationRepository.delete({ tableId: id });

    // Finally delete the table
    const result = await this.tableRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
