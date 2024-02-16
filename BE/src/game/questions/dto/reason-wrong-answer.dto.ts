import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReasonWrongAnswerDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  reason: string;
}
