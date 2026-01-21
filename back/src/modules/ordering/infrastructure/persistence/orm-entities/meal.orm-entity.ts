import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RestaurantOrmEntity } from './restaurant.orm-entity';
import { MealType } from '../../../domain/enums/meal-type.enum';

@Entity('meals')
export class MealOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'restaurant_id' })
  restaurantId: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: MealType })
  type: MealType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'required_age', type: 'int', nullable: true })
  requiredAge: number | null;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => RestaurantOrmEntity, (restaurant) => restaurant.meals)
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: RestaurantOrmEntity;
}
