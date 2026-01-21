import { IsString, IsInt, Min } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  restaurantId: number;

  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  capacity: number;
}
