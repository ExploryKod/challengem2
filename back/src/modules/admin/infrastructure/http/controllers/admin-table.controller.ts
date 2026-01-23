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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetTablesUseCase } from '../../../application/use-cases/table/get-tables.use-case';
import { GetTableUseCase } from '../../../application/use-cases/table/get-table.use-case';
import { CreateTableUseCase } from '../../../application/use-cases/table/create-table.use-case';
import { UpdateTableUseCase } from '../../../application/use-cases/table/update-table.use-case';
import { DeleteTableUseCase } from '../../../application/use-cases/table/delete-table.use-case';
import { CreateTableDto } from '../dtos/create-table.dto';
import { UpdateTableDto } from '../dtos/update-table.dto';
import { Table } from '../../../../ordering/domain/entities/table.entity';

@Controller('admin/tables')
export class AdminTableController {
  constructor(
    private readonly getTablesUseCase: GetTablesUseCase,
    private readonly getTableUseCase: GetTableUseCase,
    private readonly createTableUseCase: CreateTableUseCase,
    private readonly updateTableUseCase: UpdateTableUseCase,
    private readonly deleteTableUseCase: DeleteTableUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Table[]> {
    return this.getTablesUseCase.execute(restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Table> {
    const table = await this.getTableUseCase.execute(id);
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  @Post()
  async create(@Body() dto: CreateTableDto): Promise<Table> {
    return this.createTableUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ): Promise<Table> {
    const table = await this.updateTableUseCase.execute(id, dto);
    if (!table) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
    return table;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.deleteTableUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Table with id ${id} not found`);
    }
  }
}
