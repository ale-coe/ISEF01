import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './services/game.service';

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: {} }],
    }).compile();

    controller = app.get(GameController);
  });

  it('should be created', () => {
    expect(controller).toBeTruthy();
  });
});
