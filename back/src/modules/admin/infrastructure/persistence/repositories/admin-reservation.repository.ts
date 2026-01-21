import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  IAdminReservationRepository,
  CreateReservationData,
  UpdateReservationData,
} from '../../../application/ports/admin-reservation.repository.port';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';
import { ReservationOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/reservation.orm-entity';
import { GuestOrmEntity } from '../../../../ordering/infrastructure/persistence/orm-entities/guest.orm-entity';
import { ReservationMapper } from '../../../../ordering/infrastructure/persistence/mappers/reservation.mapper';

@Injectable()
export class AdminReservationRepository implements IAdminReservationRepository {
  constructor(
    @InjectRepository(ReservationOrmEntity)
    private readonly reservationRepository: Repository<ReservationOrmEntity>,
    @InjectRepository(GuestOrmEntity)
    private readonly guestRepository: Repository<GuestOrmEntity>,
  ) {}

  async findByRestaurantId(restaurantId: number): Promise<Reservation[]> {
    const entities = await this.reservationRepository.find({
      where: { restaurantId },
      relations: ['guests'],
    });
    return entities.map((entity) => ReservationMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Reservation | null> {
    const entity = await this.reservationRepository.findOne({
      where: { id },
      relations: ['guests'],
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }

  async create(data: CreateReservationData): Promise<Reservation> {
    const reservationOrm = new ReservationOrmEntity();
    reservationOrm.restaurantId = data.restaurantId;
    reservationOrm.tableId = data.tableId;

    // Create guest ORM entities
    reservationOrm.guests = data.guests.map((guestData) => {
      const guestOrm = new GuestOrmEntity();
      guestOrm.firstName = guestData.firstName;
      guestOrm.lastName = guestData.lastName;
      guestOrm.age = guestData.age;
      guestOrm.isOrganizer = guestData.isOrganizer;
      guestOrm.entryId = guestData.entryId ?? null;
      guestOrm.mainCourseId = guestData.mainCourseId ?? null;
      guestOrm.dessertId = guestData.dessertId ?? null;
      guestOrm.drinkId = guestData.drinkId ?? null;
      return guestOrm;
    });

    const saved = await this.reservationRepository.save(reservationOrm);
    return ReservationMapper.toDomain(saved);
  }

  async update(
    id: number,
    data: UpdateReservationData,
  ): Promise<Reservation | null> {
    const existing = await this.reservationRepository.findOne({
      where: { id },
      relations: ['guests'],
    });
    if (!existing) return null;

    if (data.restaurantId !== undefined)
      existing.restaurantId = data.restaurantId;
    if (data.tableId !== undefined) existing.tableId = data.tableId;

    // If guests are provided, replace them entirely
    if (data.guests !== undefined) {
      // Delete existing guests
      await this.guestRepository.delete({ reservationId: id });

      // Create new guests
      existing.guests = data.guests.map((guestData) => {
        const guestOrm = new GuestOrmEntity();
        guestOrm.reservationId = id;
        guestOrm.firstName = guestData.firstName;
        guestOrm.lastName = guestData.lastName;
        guestOrm.age = guestData.age;
        guestOrm.isOrganizer = guestData.isOrganizer;
        guestOrm.entryId = guestData.entryId ?? null;
        guestOrm.mainCourseId = guestData.mainCourseId ?? null;
        guestOrm.dessertId = guestData.dessertId ?? null;
        guestOrm.drinkId = guestData.drinkId ?? null;
        return guestOrm;
      });
    }

    const saved = await this.reservationRepository.save(existing);
    return ReservationMapper.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    // Delete guests first
    await this.guestRepository.delete({ reservationId: id });

    // Delete the reservation
    const result = await this.reservationRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
