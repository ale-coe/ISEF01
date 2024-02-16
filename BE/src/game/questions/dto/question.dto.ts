import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString, ValidateNested } from 'class-validator';
import { PostAnswerDto, UpdateAnswerDto } from './answer.dto';

abstract class BaseQuestionsDto {
  @IsString()
  question: string;

  @IsNumber()
  @IsIn([0, 1])
  inEdit: number;
}

export class UpdateQuestionDto extends BaseQuestionsDto {
  @IsNumber()
  id: number;

  @Type(() => UpdateAnswerDto)
  @ValidateNested({ each: true })
  answers: UpdateAnswerDto[];
}

export class InsertQuestionDto extends BaseQuestionsDto {
  @Type(() => PostAnswerDto)
  @ValidateNested({ each: true })
  answers: PostAnswerDto[];
}
