import { Test } from '@nestjs/testing';
import { GameGateway } from './game.gateway';
import { GameService } from './services/game.service';
import { AuthService } from '../../auth/services/auth.service';

describe('GameGateway', () => {
  let gateway: GameGateway;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        GameGateway,
        { provide: GameService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    gateway = app.get(GameGateway);
  });

  it('should be created', () => {
    expect(gateway).toBeTruthy();
  });
});
