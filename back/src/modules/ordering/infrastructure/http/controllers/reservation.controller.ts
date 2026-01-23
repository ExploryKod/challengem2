import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateReservationUseCase } from '../../../application/use-cases/create-reservation.use-case';
import { GetReservationsUseCase } from '../../../application/use-cases/get-reservations.use-case';
import { GetReservationByIdUseCase } from '../../../application/use-cases/get-reservation-by-id.use-case';
import { GetReservationByCodeUseCase } from '../../../application/use-cases/get-reservation-by-code.use-case';
import { UpdateReservationUseCase } from '../../../application/use-cases/update-reservation.use-case';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';
import { Reservation } from '../../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../../domain/enums/reservation-status.enum';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationByIdUseCase: GetReservationByIdUseCase,
    private readonly getReservationByCodeUseCase: GetReservationByCodeUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.getReservationsUseCase.execute();
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string): Promise<Reservation> {
    const reservation = await this.getReservationByCodeUseCase.execute(code);
    if (!reservation) {
      throw new NotFoundException(`Reservation with code ${code} not found`);
    }
    return reservation;
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

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.updateReservationUseCase.execute(id, dto);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: ReservationStatus,
  ): Promise<Reservation> {
    const reservation = await this.updateReservationUseCase.execute(id, {
      status,
    });
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }
}
