import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { AnswerEntity } from 'src/database/entities/answer.entity';
import { GameQuestionEntity } from 'src/database/entities/game-question.entity';
import { GameUserEntity } from 'src/database/entities/game-user.entity';
import { GameEntity } from 'src/database/entities/game.entity';
import { QuestionEntity } from 'src/database/entities/question.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { GameController } from './game/game.controller';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/services/game.service';
import { QuestionsController } from './questions/questions.controller';
import { QuestionsService } from './questions/services/questions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
