import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from 'src/database/entities/answer.entity';
import { QuestionEntity } from 'src/database/entities/question.entity';
import { ReasonWrongAnswerEntity } from 'src/database/entities/reason-wrong-answer.entity';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/services/questions.service';
import { GameService } from './game/services/game.service';
import { GameController } from './game/game.controller';
import { GameEntity } from 'src/database/entities/game.entity';
import { GameQuestionEntity } from 'src/database/entities/game-question.entity';
import { GameUserEntity } from 'src/database/entities/game-user.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { GameGateway } from './game/game.gateway';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReasonWrongAnswerEntity,
      QuestionEntity,
      AnswerEntity,
      GameQuestionEntity,
      GameEntity,
      GameUserEntity,
      UserEntity,
    ]),
  ],
  controllers: [QuestionsController, GameController],
  providers: [QuestionsService, GameService, GameGateway, AuthService],
  exports: [],
})
export class GameModule {}
