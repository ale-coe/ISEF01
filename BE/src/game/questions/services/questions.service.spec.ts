import { Test } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { QuestionEntity } from '../../../database/entities/question.entity';
import { GameUserEntity } from '../../../database/entities/game-user.entity';
import { GameQuestionEntity } from '../../../database/entities/game-question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: getRepositoryToken(GameQuestionEntity), useValue: {} },
        { provide: getRepositoryToken(GameUserEntity), useValue: {} },
        { provide: getRepositoryToken(QuestionEntity), useValue: {} },
      ],
    }).compile();

    service = app.get(QuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
