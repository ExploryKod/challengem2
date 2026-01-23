import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GetRestaurantsUseCase } from '../../../application/use-cases/restaurant/get-restaurants.use-case';
import { GetRestaurantUseCase } from '../../../application/use-cases/restaurant/get-restaurant.use-case';
import { CreateRestaurantUseCase } from '../../../application/use-cases/restaurant/create-restaurant.use-case';
import { UpdateRestaurantUseCase } from '../../../application/use-cases/restaurant/update-restaurant.use-case';
import { DeleteRestaurantUseCase } from '../../../application/use-cases/restaurant/delete-restaurant.use-case';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from '../../../../ordering/domain/entities/restaurant.entity';

@Controller('admin/restaurants')
export class AdminRestaurantController {
  constructor(
    private readonly getRestaurantsUseCase: GetRestaurantsUseCase,
    private readonly getRestaurantUseCase: GetRestaurantUseCase,
    private readonly createRestaurantUseCase: CreateRestaurantUseCase,
    private readonly updateRestaurantUseCase: UpdateRestaurantUseCase,
    private readonly deleteRestaurantUseCase: DeleteRestaurantUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Restaurant[]> {
    return this.getRestaurantsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Restaurant> {
    const restaurant = await this.getRestaurantUseCase.execute(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  @Post()
  async create(@Body() dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.createRestaurantUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.updateRestaurantUseCase.execute(id, dto);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
    return restaurant;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const deleted = await this.deleteRestaurantUseCase.execute(id);
    if (!deleted) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }
  }
}
