import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IReservationRepository } from '../../../application/ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
  ) {}

  async save(reservation: Reservation): Promise<Reservation> {
    const ormEntity = ReservationMapper.toOrm(reservation);
    const saved = await this.repository.save(ormEntity);
    return this.findById(saved.id) as Promise<Reservation>;
  }

  async findAll(): Promise<Reservation[]> {
    const entities = await this.repository.find({
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async findById(id: number): Promise<Reservation | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['guests'],
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findByCode(code: string): Promise<Reservation | null> {
    const entity = await this.repository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.guests', 'guest')
      .where('UPPER(reservation.reservation_code) = :code', { code: code.toUpperCase() })
      .getOne();
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async findByRestaurantIdAndStatus(
    restaurantId: number,
    status: ReservationStatus,
  ): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId, status },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(ReservationMapper.toDomain);
  }

  async update(id: number, data: Partial<Reservation>): Promise<Reservation | null> {
    await this.repository.update(id, {
      ...(data.tableId && { tableId: data.tableId }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
    });
    return this.findById(id);
  }

  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
