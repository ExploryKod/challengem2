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
import { GetMealsUseCase } from '../../../application/use-cases/meal/get-meals.use-case';
import { GetMealUseCase } from '../../../application/use-cases/meal/get-meal.use-case';
import { CreateMealUseCase } from '../../../application/use-cases/meal/create-meal.use-case';
import { UpdateMealUseCase } from '../../../application/use-cases/meal/update-meal.use-case';
import { DeleteMealUseCase } from '../../../application/use-cases/meal/delete-meal.use-case';
import { CreateMealDto } from '../dtos/create-meal.dto';
import { UpdateMealDto } from '../dtos/update-meal.dto';
import { Meal } from '../../../../ordering/domain/entities/meal.entity';

@Controller('admin/meals')
export class AdminMealController {
  constructor(
    private readonly getMealsUseCase: GetMealsUseCase,
    private readonly getMealUseCase: GetMealUseCase,
    private readonly createMealUseCase: CreateMealUseCase,
    private readonly updateMealUseCase: UpdateMealUseCase,
    private readonly deleteMealUseCase: DeleteMealUseCase,
  ) {}

  @Get()
  async findAll(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<Meal[]> {
    return this.getMealsUseCase.execute(restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
    const meal = await this.getMealUseCase.execute(id);
    if (!meal) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }
    return meal;
  }

  @Post()
  async create(@Body() dto: CreateMealDto): Promise<Meal> {
    return this.createMealUseCase.execute({
      ...dto,
      requiredAge: dto.requiredAge ?? null,
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMealDto,
  ): Promise<Meal> {
    const meal = await this.updateMealUseCase.execute(id, dto);
    if (!meal) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }
    return meal;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.deleteMealUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Meal with id ${id} not found`);
    }
  }
}
