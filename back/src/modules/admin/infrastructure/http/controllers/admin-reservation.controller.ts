import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { GetReservationsUseCase } from '../../../application/use-cases/reservation/get-reservations.use-case';
import { GetReservationUseCase } from '../../../application/use-cases/reservation/get-reservation.use-case';
import { CreateReservationUseCase } from '../../../application/use-cases/reservation/create-reservation.use-case';
import { UpdateReservationUseCase } from '../../../application/use-cases/reservation/update-reservation.use-case';
import { DeleteReservationUseCase } from '../../../application/use-cases/reservation/delete-reservation.use-case';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { UpdateReservationDto } from '../dtos/update-reservation.dto';
import { Reservation } from '../../../../ordering/domain/entities/reservation.entity';

@Controller('admin/reservations')
export class AdminReservationController {
  constructor(
    private readonly getReservationsUseCase: GetReservationsUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly updateReservationUseCase: UpdateReservationUseCase,
    private readonly deleteReservationUseCase: DeleteReservationUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Reservation[]> {
    return this.getReservationsUseCase.execute(restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Reservation> {
    const reservation = await this.getReservationUseCase.execute(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
    return reservation;
  }

  @Post()
  async create(@Body() dto: CreateReservationDto): Promise<Reservation> {
    return this.createReservationUseCase.execute({
      restaurantId: dto.restaurantId,
      tableId: dto.tableId,
      guests: dto.guests,
    });
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.deleteReservationUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Reservation with id ${id} not found`);
    }
  }
}
