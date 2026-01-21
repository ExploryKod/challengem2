import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateTableDto {
  @IsOptional()
  @IsInt()
  restaurantId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
