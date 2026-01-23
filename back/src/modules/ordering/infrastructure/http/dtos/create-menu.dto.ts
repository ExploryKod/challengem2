import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MealType } from '../../../domain/enums/meal-type.enum';

export class MenuItemDto {
  @IsEnum(MealType)
  mealType: MealType;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateMenuDto {
  @IsInt()
  @Type(() => Number)
  restaurantId: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];
}
