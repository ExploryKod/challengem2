import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import { MealType } from '../../domain/enums/meal-type.enum';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

export interface UpdateMenuItemInput {
  mealType: MealType;
  quantity: number;
}

export interface UpdateMenuInput {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isActive?: boolean;
  items?: UpdateMenuItemInput[];
}

@Injectable()
export class UpdateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(id: number, input: UpdateMenuInput): Promise<Menu | null> {
    return this.menuRepository.update(id, input as Partial<Menu>);
  }
}
