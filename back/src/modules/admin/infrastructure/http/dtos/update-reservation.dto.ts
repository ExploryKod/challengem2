import {
  IsInt,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdminGuestDto } from './admin-guest.dto';

export class UpdateReservationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  restaurantId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tableId?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AdminGuestDto)
  guests?: AdminGuestDto[];
}
