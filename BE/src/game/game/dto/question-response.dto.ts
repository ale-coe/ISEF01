import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class Answer {
  @Expose()
  @IsString()
  answer: string;
}

export class QuestionResponseDto {
  @Expose()
  @IsString()
  question: string;

  @Expose()
  @Type(() => Answer)
  @ValidateNested({ each: true })
  answers: Answer[];
}
