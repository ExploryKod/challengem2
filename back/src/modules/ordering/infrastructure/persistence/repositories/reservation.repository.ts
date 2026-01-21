import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IReservationRepository } from '../../../application/ports/reservation.repository.port';
import { Reservation } from '../../../domain/entities/reservation.entity';
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
    return ReservationMapper.toDomain(saved);
  }

  async findAll(): Promise<Reservation[]> {
    const entities = await this.repository.find({
      relations: ['guests'],
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => ReservationMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Reservation | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['guests'],
    });
    return entity ? ReservationMapper.toDomain(entity) : null;
  }
}
