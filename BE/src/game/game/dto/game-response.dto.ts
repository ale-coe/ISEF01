import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

class User {
  @Expose()
  @IsString()
  mail: string;
}

class GameUser {
  @Expose()
  @IsNumber()
  correct: number;

  @Expose()
  @IsNumber()
  incorrect: number;

  @Expose()
  @Type(() => User)
  @ValidateNested()
  user: User;
}

export class GameResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsNumber()
  isCoop: number;

  @Expose()
  @Type(() => GameUser)
  @ValidateNested({ each: true })
  gameUser: GameUser[];
}
