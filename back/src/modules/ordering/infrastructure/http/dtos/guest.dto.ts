import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNumber()
  @Min(0)
  age: number;

  @IsBoolean()
  isOrganizer: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  entryId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  entryQuantity?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  mainCourseId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  mainCourseQuantity?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  dessertId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  dessertQuantity?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  drinkId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  drinkQuantity?: number;
}
