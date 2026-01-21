import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { GetTablesUseCase } from '../../../application/use-cases/get-tables.use-case';
import { Table } from '../../../domain/entities/table.entity';

@Controller('tables')
export class TableController {
  constructor(private readonly getTablesUseCase: GetTablesUseCase) {}

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
}
