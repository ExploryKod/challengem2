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
      guests: dto.guests.map((g) => ({
        firstName: g.firstName,
        lastName: g.lastName,
        age: g.age,
        isOrganizer: g.isOrganizer,
        entryId: g.entryId,
        mainCourseId: g.mainCourseId,
        dessertId: g.dessertId,
        drinkId: g.drinkId,
      })),
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const updateData: {
      restaurantId?: number;
      tableId?: number;
      guests?: Array<{
        firstName: string;
        lastName: string;
        age: number;
        isOrganizer: boolean;
        entryId?: number | null;
        mainCourseId?: number | null;
        dessertId?: number | null;
        drinkId?: number | null;
      }>;
    } = {};

    if (dto.restaurantId !== undefined) {
      updateData.restaurantId = dto.restaurantId;
    }
    if (dto.tableId !== undefined) {
      updateData.tableId = dto.tableId;
    }
    if (dto.guests !== undefined) {
      updateData.guests = dto.guests.map((g) => ({
        firstName: g.firstName,
        lastName: g.lastName,
        age: g.age,
        isOrganizer: g.isOrganizer,
        entryId: g.entryId,
        mainCourseId: g.mainCourseId,
        dessertId: g.dessertId,
        drinkId: g.drinkId,
      }));
    }

    const reservation = await this.updateReservationUseCase.execute(
      id,
      updateData,
    );
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
