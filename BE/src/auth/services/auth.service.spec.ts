import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
      ],
    }).compile();

    service = app.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
