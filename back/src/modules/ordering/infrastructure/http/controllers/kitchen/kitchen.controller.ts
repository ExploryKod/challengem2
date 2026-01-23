import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { GetKitchenOrdersUseCase } from '../../../../application/use-cases/kitchen/get-kitchen-orders.use-case';
import { MarkCourseReadyUseCase } from '../../../../application/use-cases/kitchen/mark-course-ready.use-case';
import { MarkCourseReadyDto } from '../../dtos/kitchen/mark-course-ready.dto';

@Controller('kitchen')
export class KitchenController {
  constructor(
    private readonly getKitchenOrdersUseCase: GetKitchenOrdersUseCase,
    private readonly markCourseReadyUseCase: MarkCourseReadyUseCase,
  ) {}

  @Get('orders')
  async getOrders(@Query('restaurantId', ParseIntPipe) restaurantId: number) {
    const orders = await this.getKitchenOrdersUseCase.execute(restaurantId);
    return orders.map((order) => this.toResponse(order));
  }

  @Patch('orders/:reservationId/course-ready')
  async markCourseReady(
    @Param('reservationId', ParseIntPipe) reservationId: number,
    @Body() dto: MarkCourseReadyDto,
  ) {
    const result = await this.markCourseReadyUseCase.execute(
      reservationId,
      dto.course,
    );

    if (!result) {
      throw new NotFoundException(`Reservation ${reservationId} not found`);
    }

    return this.toResponse(result);
  }

  private toResponse(reservation: any) {
    // Aggregate meals from all guests
    const meals = {
      entry: { count: 0, items: [] as string[] },
      mainCourse: { count: 0, items: [] as string[] },
      dessert: { count: 0, items: [] as string[] },
      drink: { count: 0, items: [] as string[] },
    };

    for (const guest of reservation.guests || []) {
      if (guest.meals?.entry) {
        meals.entry.count += guest.meals.entry.quantity || 1;
      }
      if (guest.meals?.mainCourse) {
        meals.mainCourse.count += guest.meals.mainCourse.quantity || 1;
      }
      if (guest.meals?.dessert) {
        meals.dessert.count += guest.meals.dessert.quantity || 1;
      }
      if (guest.meals?.drink) {
        meals.drink.count += guest.meals.drink.quantity || 1;
      }
    }

    return {
      id: reservation.id,
      tableId: reservation.tableId,
      guestCount: reservation.guests?.length || 0,
      status: reservation.status,
      createdAt: reservation.createdAt,
      meals,
      coursesReady: reservation.coursesReady,
    };
  }
}
