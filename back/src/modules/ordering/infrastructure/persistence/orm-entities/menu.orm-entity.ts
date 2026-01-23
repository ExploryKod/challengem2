import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { MenuItemOrmEntity } from './menu-item.orm-entity';

@Entity('menus')
export class MenuOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RestaurantOrmEntity)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;

  @OneToMany(() => MenuItemOrmEntity, (item) => item.menu, { cascade: true })
  items: MenuItemOrmEntity[];
}
