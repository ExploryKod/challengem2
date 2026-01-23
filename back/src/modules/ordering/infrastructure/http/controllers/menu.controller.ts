import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetMenusUseCase } from '../../../application/use-cases/get-menus.use-case';
import { CreateMenuUseCase } from '../../../application/use-cases/create-menu.use-case';
import { UpdateMenuUseCase } from '../../../application/use-cases/update-menu.use-case';
import { DeleteMenuUseCase } from '../../../application/use-cases/delete-menu.use-case';
import { CreateMenuDto } from '../dtos/create-menu.dto';
import { UpdateMenuDto } from '../dtos/update-menu.dto';
import { Menu } from '../../../domain/entities/menu.entity';

@Controller('menus')
export class MenuController {
  constructor(
    private readonly getMenusUseCase: GetMenusUseCase,
    private readonly createMenuUseCase: CreateMenuUseCase,
    private readonly updateMenuUseCase: UpdateMenuUseCase,
    private readonly deleteMenuUseCase: DeleteMenuUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<Menu[]> {
    const restId = restaurantId ? parseInt(restaurantId, 10) : undefined;
    const active = activeOnly === 'true';
    return this.getMenusUseCase.execute(restId, active);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Menu> {
    const menu = await this.getMenusUseCase.executeOne(id);
    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return menu;
  }

  @Post()
  async create(@Body() dto: CreateMenuDto): Promise<Menu> {
    return this.createMenuUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.updateMenuUseCase.execute(id, dto);
    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }
    return menu;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteMenuUseCase.execute(id);
  }
}
