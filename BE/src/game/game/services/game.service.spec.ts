import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameQuestionEntity } from '../../../database/entities/game-question.entity';
import { GameUserEntity } from '../../../database/entities/game-user.entity';
import { GameEntity } from '../../../database/entities/game.entity';
import { QuestionEntity } from '../../../database/entities/question.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: getRepositoryToken(GameQuestionEntity), useValue: {} },
        { provide: getRepositoryToken(GameUserEntity), useValue: {} },
        { provide: getRepositoryToken(GameEntity), useValue: {} },
        { provide: getRepositoryToken(QuestionEntity), useValue: {} },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
      ],
    }).compile();

    service = app.get(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
