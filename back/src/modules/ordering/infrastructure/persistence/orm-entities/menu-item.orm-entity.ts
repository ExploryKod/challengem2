import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MenuOrmEntity } from './menu.orm-entity';
import { MealType } from '../../../domain/enums/meal-type.enum';

@Entity('menu_items')
export class MenuItemOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'menu_id' })
  menuId: number;

  @Column({ type: 'enum', enum: MealType, name: 'meal_type' })
  mealType: MealType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => MenuOrmEntity, (menu) => menu.items)
  @JoinColumn({ name: 'menu_id' })
  menu: MenuOrmEntity;
}
