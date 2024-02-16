import { IsNumber, IsString, IsIn, ValidateNested } from 'class-validator';
import { ReasonWrongAnswerDto } from './reason-wrong-answer.dto';
import { Type } from 'class-transformer';

abstract class BaseAnswerDto {
  @IsString()
  answer: string;

  @IsNumber()
  @IsIn([0, 1])
  isCorrect: number;
}

export class UpdateAnswerDto extends BaseAnswerDto {
  @IsNumber()
  id: number;

  @Type(() => ReasonWrongAnswerDto)
  @ValidateNested()
  reasonWrongAnswer: ReasonWrongAnswerDto;
}

export class PostAnswerDto extends BaseAnswerDto {
  @Type(() => ReasonWrongAnswerDto)
  @ValidateNested()
  reasonWrongAnswer: ReasonWrongAnswerDto;
}
