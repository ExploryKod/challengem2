import { MenuItem } from './menu-item.entity';

export class Menu {
  id: number;
  restaurantId: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  items: MenuItem[];
  createdAt: Date;
  updatedAt: Date;
}
