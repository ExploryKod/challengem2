import { IsInt, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { GuestDto } from './guest.dto';

export class CreateReservationDto {
  @IsInt()
  @Type(() => Number)
  restaurantId: number;

  @IsInt()
  @Type(() => Number)
  tableId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];
}
