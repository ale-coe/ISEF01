import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';

export class GetQuestionsDto {
  @Type(() => Number)
  @IsNumber()
  @IsIn([0, 1])
  inEdit: number;

  @Type(() => Number)
  @IsNumber()
  limit: number;

  @Type(() => Number)
  @IsNumber()
  offset: number;
}
