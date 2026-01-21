import { IsString, IsInt, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { MealType } from '../../../../ordering/domain/enums/meal-type.enum';

export class UpdateMealDto {
  @IsOptional()
  @IsInt()
  restaurantId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(MealType)
  type?: MealType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  requiredAge?: number | null;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
