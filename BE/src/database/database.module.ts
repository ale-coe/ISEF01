import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ReasonWrongAnswerEntity } from './entities/reason-wrong-answer.entity';
import { QuestionEntity } from './entities/question.entity';
import { AnswerEntity } from './entities/answer.entity';
import { GameQuestionEntity } from './entities/game-question.entity';
import { GameEntity } from './entities/game.entity';
import { GameUserEntity } from './entities/game-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: (() => {
        console.log(process.env.DB_PATH);
        console.log(__dirname);
        console.log(__filename);
        return process.env.DB_PATH;
      })(),
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
})
export class DatabaseModule {}
