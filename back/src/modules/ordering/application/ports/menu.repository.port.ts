import { Menu } from '../../domain/entities/menu.entity';

export const MENU_REPOSITORY = Symbol('MENU_REPOSITORY');

export interface IMenuRepository {
  save(menu: Menu): Promise<Menu>;
  findAll(): Promise<Menu[]>;
  findById(id: number): Promise<Menu | null>;
  findByRestaurantId(restaurantId: number): Promise<Menu[]>;
  findActiveByRestaurantId(restaurantId: number): Promise<Menu[]>;
  update(id: number, data: Partial<Menu>): Promise<Menu | null>;
  delete(id: number): Promise<void>;
}
