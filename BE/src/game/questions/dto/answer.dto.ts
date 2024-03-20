import { IsIn, IsNumber, IsString } from 'class-validator';

export class PostAnswerDto {
  @IsString()
  answer: string;

  @IsNumber()
  @IsIn([0, 1])
  isCorrect: number;

  @IsString()
  reasonWrong: string;
}

export class UpdateAnswerDto extends PostAnswerDto {
  @IsNumber()
  id: number;
}
