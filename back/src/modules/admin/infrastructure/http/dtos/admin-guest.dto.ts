import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminGuestDto {
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
  @Type(() => Number)
  mainCourseId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  dessertId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  drinkId?: number;
}
