import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { MealType } from '../../domain/enums/meal-type.enum';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

export interface CreateMenuItemInput {
  mealType: MealType;
  quantity: number;
}

export interface CreateMenuInput {
  restaurantId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  items?: CreateMenuItemInput[];
}

@Injectable()
export class CreateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(input: CreateMenuInput): Promise<Menu> {
    const menu = new Menu();
    menu.restaurantId = input.restaurantId;
    menu.title = input.title;
    menu.description = input.description;
    menu.price = input.price;
    menu.imageUrl = input.imageUrl;
    menu.isActive = true;
    menu.items = (input.items ?? []).map((item) => {
      const menuItem = new MenuItem();
      menuItem.mealType = item.mealType;
      menuItem.quantity = item.quantity;
      return menuItem;
    });

    return this.menuRepository.save(menu);
  }
}
