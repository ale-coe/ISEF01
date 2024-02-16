import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';

export class StartGameDto {
  @Type(() => Number)
  @IsNumber()
  @IsIn([0, 1])
  isCoop: number;
}
