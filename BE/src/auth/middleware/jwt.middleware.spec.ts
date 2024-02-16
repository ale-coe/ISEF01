import { Test } from '@nestjs/testing';

import { JwtMiddleware } from './jwt.middleware';
import { AuthService } from '../services/auth.service';

describe('JwtMiddleware', () => {
  let middleware: JwtMiddleware;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [JwtMiddleware, { provide: AuthService, useValue: {} }],
    }).compile();

    middleware = app.get(JwtMiddleware);
  });

  it('should be created', () => {
    expect(middleware).toBeTruthy();
  });
});
