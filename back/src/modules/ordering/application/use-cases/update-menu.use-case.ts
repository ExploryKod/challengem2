import { Injectable, Inject } from '@nestjs/common';
import { Menu } from '../../domain/entities/menu.entity';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

export interface UpdateMenuInput {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isActive?: boolean;
}

@Injectable()
export class UpdateMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(id: number, input: UpdateMenuInput): Promise<Menu | null> {
    return this.menuRepository.update(id, input);
  }
}
