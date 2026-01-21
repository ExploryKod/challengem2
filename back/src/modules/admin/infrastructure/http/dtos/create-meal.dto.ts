import { IsString, IsInt, IsNumber, IsEnum, IsOptional, IsUrl, Min } from 'class-validator';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

export class CreateMealDto {
  @IsInt()
  restaurantId: number;

  @IsString()
  title: string;

  @IsEnum(MealType)
  type: MealType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredAge?: number | null;

  @IsString()
  imageUrl: string;
}
