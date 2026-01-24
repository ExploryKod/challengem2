import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { GetTablesUseCase } from '../../../application/use-cases/get-tables.use-case';
import { GetActiveOrderByTableUseCase } from '../../../application/use-cases/get-active-order-by-table.use-case';
import { Table } from '../../../domain/entities/table.entity';
import { Reservation } from '../../../domain/entities/reservation.entity';

@Controller('tables')
export class TableController {
  constructor(
    private readonly getTablesUseCase: GetTablesUseCase,
    private readonly getActiveOrderByTableUseCase: GetActiveOrderByTableUseCase,
  ) {}

  @Get()
  async findByRestaurant(
    @Query(
      'restaurantId',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException('restaurantId must be a valid number'),
      }),
    )
    restaurantId: number,
  ): Promise<Table[]> {
    return this.getTablesUseCase.execute(restaurantId);
  }

  @Get(':id/active-order')
  async getActiveOrder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Reservation | null> {
    return this.getActiveOrderByTableUseCase.execute(id);
  }
}
