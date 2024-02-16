import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './services/questions.service';

fdescribe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [{ provide: QuestionsService, useValue: {} }],
    }).compile();

    controller = app.get(QuestionsController);
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });
});
