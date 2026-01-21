import { Controller, Post, Body } from '@nestjs/common';
import { CreateReservationUseCase } from '../../../application/use-cases/create-reservation.use-case';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.createReservationUseCase.execute(dto);
  }
}
