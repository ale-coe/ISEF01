import { TestBed } from '@angular/core/testing';
import { LoginGuard } from './login.guard';
import { AuthService } from '../services/auth.service';

describe('LoginGuard', () => {
  let guard: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginGuard, { provide: AuthService, useValue: {} }],
    });
    guard = TestBed.get(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
