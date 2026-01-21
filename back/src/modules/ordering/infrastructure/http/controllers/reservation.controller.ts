import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReservationUseCase } from '../../../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../../../application/use-cases/get-reservations.use-case';
import { GetReservationByIdUseCase } from '../../../application/use-cases/get-reservation-by-id.use-case';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationByIdUseCase: GetReservationByIdUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.getReservationsUseCase.execute();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    const reservation = await this.getReservationByIdUseCase.execute(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  @Post()
  async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.createReservationUseCase.execute(dto);
  }
}
