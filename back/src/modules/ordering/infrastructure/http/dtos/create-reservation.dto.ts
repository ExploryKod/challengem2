import { IsUUID, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { GuestDto } from './guest.dto';

export class CreateReservationDto {
  @IsUUID()
  restaurantId: string;

  @IsUUID()
  tableId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests: GuestDto[];
}
