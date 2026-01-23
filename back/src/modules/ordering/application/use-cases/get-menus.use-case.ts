import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

@Injectable()
export class GetMenusUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(restaurantId?: number, activeOnly?: boolean): Promise<Menu[]> {
    if (restaurantId) {
      if (activeOnly) {
        return this.menuRepository.findActiveByRestaurantId(restaurantId);
      }
      return this.menuRepository.findByRestaurantId(restaurantId);
    }
    return this.menuRepository.findAll();
  }
}
