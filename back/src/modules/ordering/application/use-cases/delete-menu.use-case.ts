import { Injectable, Inject } from '@nestjs/common';
import type { IMenuRepository } from '../ports/menu.repository.port';
import { MENU_REPOSITORY } from '../ports/menu.repository.port';

@Injectable()
export class DeleteMenuUseCase {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly menuRepository: IMenuRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.menuRepository.delete(id);
  }
}
