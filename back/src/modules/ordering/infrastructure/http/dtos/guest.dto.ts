import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

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
  @IsUUID()
  entryId?: string;

  @IsOptional()
  @IsUUID()
  mainCourseId?: string;

  @IsOptional()
  @IsUUID()
  dessertId?: string;

  @IsOptional()
  @IsUUID()
  drinkId?: string;
}
