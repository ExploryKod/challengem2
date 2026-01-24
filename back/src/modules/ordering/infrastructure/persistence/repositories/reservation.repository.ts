import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import type { IReservationRepository } from '../../../application/ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { Guest } from '../../../domain/entities/guest.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';
import { ReservationOrmEntity } from '../orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../orm-entities/guest.orm-entity';
import { ReservationMapper } from '../mappers/reservation.mapper';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly repository: Repository<ReservationOrmEntity>,
    @InjectRepository(GuestOrmEntity)
    private readonly guestRepository: Repository<GuestOrmEntity>,
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
    return entities.map((e) => ReservationMapper.toDomain(e));
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
      .where('UPPER(reservation.reservation_code) = :code', {
        code: code.toUpperCase(),
      })
      .getOne();
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => ReservationMapper.toDomain(e));
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
    return entities.map((e) => ReservationMapper.toDomain(e));
  }

  async findByRestaurantIdAndStatuses(
    restaurantId: number,
    statuses: ReservationStatus[],
  ): Promise<Reservation[]> {
    const entities = await this.repository.find({
      where: { restaurantId, status: In(statuses) },
      relations: ['guests'],
      order: { createdAt: 'ASC' },
    });
    return entities.map((e) => ReservationMapper.toDomain(e));
  }

  async findActiveByTableId(
    tableId: number,
    statuses: ReservationStatus[],
  ): Promise<Reservation | null> {
    const entity = await this.repository.findOne({
      where: { tableId, status: In(statuses) },
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async addGuests(
    reservationId: number,
    guests: Guest[],
  ): Promise<Reservation> {
    const guestOrmEntities = guests.map((g) =>
      ReservationMapper.guestToOrm(g, reservationId),
    );
    await this.guestRepository.save(guestOrmEntities);
    return this.findById(reservationId) as Promise<Reservation>;
  }

  async update(
    id: number,
    data: Partial<Reservation>,
  ): Promise<Reservation | null> {
    await this.repository.update(id, {
      ...(data.tableId && { tableId: data.tableId }),
      ...(data.status && { status: data.status }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.coursesReady && { coursesReady: data.coursesReady }),
    });
    return this.findById(id);
  }

  async updateStatus(
    id: number,
    status: ReservationStatus,
  ): Promise<Reservation | null> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
