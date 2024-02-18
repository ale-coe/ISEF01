import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ReasonWrongAnswerEntity } from './entities/reason-wrong-answer.entity';
import { QuestionEntity } from './entities/question.entity';
import { AnswerEntity } from './entities/answer.entity';
import { GameQuestionEntity } from './entities/game-question.entity';
import { GameEntity } from './entities/game.entity';
import { GameUserEntity } from './entities/game-user.entity';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: process.env.DB_PATH,
          enableWAL: true,
          entities: [
            AnswerEntity,
            GameQuestionEntity,
            GameEntity,
            QuestionEntity,
            ReasonWrongAnswerEntity,
            GameUserEntity,
            UserEntity,
          ],
        }),
      ],
    };
  }
}
