import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  NotFoundException,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { GetKitchenOrdersUseCase } from '../../../../application/use-cases/kitchen/get-kitchen-orders.use-case';
import { GetCompletedOrdersUseCase } from '../../../../application/use-cases/kitchen/get-completed-orders.use-case';
import { MarkCourseReadyUseCase } from '../../../../application/use-cases/kitchen/mark-course-ready.use-case';
import { MarkCourseReadyDto } from '../../dtos/kitchen/mark-course-ready.dto';
import type { IMealRepository } from '../../../../application/ports/meal.repository.port';
import { MEAL_REPOSITORY } from '../../../../application/ports/meal.repository.port';
import { Meal } from '../../../../domain/entities/meal.entity';
import { Reservation } from '../../../../domain/entities/reservation.entity';
import { MealSelection } from '../../../../domain/entities/guest.entity';

type CourseType = 'entry' | 'mainCourse' | 'dessert' | 'drink';

interface MealCount {
  count: number;
  items: string[];
}

interface KitchenOrderResponse {
  id: number;
  tableId: number;
  guestCount: number;
  status: string;
  createdAt: Date;
  meals: Record<CourseType, MealCount>;
  coursesReady: Record<CourseType, boolean>;
}

@Controller('kitchen')
export class KitchenController {
  constructor(
    private readonly getKitchenOrdersUseCase: GetKitchenOrdersUseCase,
    private readonly getCompletedOrdersUseCase: GetCompletedOrdersUseCase,
    private readonly markCourseReadyUseCase: MarkCourseReadyUseCase,
    @Inject(MEAL_REPOSITORY)
    private readonly mealRepository: IMealRepository,
  ) {}

  @Get('orders')
  async getOrders(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
  ): Promise<KitchenOrderResponse[]> {
    const orders = await this.getKitchenOrdersUseCase.execute(restaurantId);
    const mealIds = this.extractMealIds(orders);
    const mealsMap = await this.getMealsMap(mealIds);
    return orders.map((order) => this.toResponse(order, mealsMap));
  }

  @Get('orders/completed')
  async getCompletedOrders(
    @Query('restaurantId', ParseIntPipe) restaurantId: number,
    @Query('limit') limit?: string,
  ): Promise<KitchenOrderResponse[]> {
    const orders = await this.getCompletedOrdersUseCase.execute(
      restaurantId,
      limit ? parseInt(limit, 10) : 20,
    );
    const mealIds = this.extractMealIds(orders);
    const mealsMap = await this.getMealsMap(mealIds);
    return orders.map((order) => this.toResponse(order, mealsMap));
  }

  @Patch('orders/:reservationId/course-ready')
  async markCourseReady(
    @Param('reservationId', ParseIntPipe) reservationId: number,
    @Body() dto: MarkCourseReadyDto,
  ): Promise<KitchenOrderResponse> {
    const result = await this.markCourseReadyUseCase.execute(
      reservationId,
      dto.course,
    );

    if (!result) {
      throw new NotFoundException(`Reservation ${reservationId} not found`);
    }

    const mealIds = this.extractMealIds([result]);
    const mealsMap = await this.getMealsMap(mealIds);
    return this.toResponse(result, mealsMap);
  }

  private extractMealIds(orders: Reservation[]): number[] {
    const ids = new Set<number>();
    for (const order of orders) {
      for (const guest of order.guests ?? []) {
        this.addMealIdIfPresent(ids, guest.meals?.entry);
        this.addMealIdIfPresent(ids, guest.meals?.mainCourse);
        this.addMealIdIfPresent(ids, guest.meals?.dessert);
        this.addMealIdIfPresent(ids, guest.meals?.drink);
      }
    }
    return Array.from(ids);
  }

  private addMealIdIfPresent(
    ids: Set<number>,
    selection: MealSelection | null | undefined,
  ): void {
    if (selection?.mealId) {
      ids.add(selection.mealId);
    }
  }

  private async getMealsMap(mealIds: number[]): Promise<Map<number, Meal>> {
    const meals = await this.mealRepository.findByIds(mealIds);
    return new Map(meals.map((meal) => [meal.id, meal]));
  }

  private toResponse(
    reservation: Reservation,
    mealsMap: Map<number, Meal>,
  ): KitchenOrderResponse {
    const meals: Record<CourseType, MealCount> = {
      entry: { count: 0, items: [] },
      mainCourse: { count: 0, items: [] },
      dessert: { count: 0, items: [] },
      drink: { count: 0, items: [] },
    };

    for (const guest of reservation.guests ?? []) {
      this.aggregateMealForCourse(meals.entry, guest.meals?.entry, mealsMap);
      this.aggregateMealForCourse(
        meals.mainCourse,
        guest.meals?.mainCourse,
        mealsMap,
      );
      this.aggregateMealForCourse(
        meals.dessert,
        guest.meals?.dessert,
        mealsMap,
      );
      this.aggregateMealForCourse(meals.drink, guest.meals?.drink, mealsMap);
    }

    return {
      id: reservation.id,
      tableId: reservation.tableId,
      guestCount: reservation.guests?.length ?? 0,
      status: reservation.status,
      createdAt: reservation.createdAt,
      meals,
      coursesReady: reservation.coursesReady,
    };
  }

  private aggregateMealForCourse(
    mealCount: MealCount,
    selection: MealSelection | null | undefined,
    mealsMap: Map<number, Meal>,
  ): void {
    if (!selection) return;

    const quantity = selection.quantity || 1;
    mealCount.count += quantity;

    const meal = mealsMap.get(selection.mealId);
    if (meal) {
      const label = quantity > 1 ? `${meal.title} x${quantity}` : meal.title;
      mealCount.items.push(label);
    }
  }
}
