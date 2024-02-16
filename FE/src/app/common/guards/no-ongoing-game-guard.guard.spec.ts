import { TestBed } from '@angular/core/testing';
import { NoOngoingGameGuard } from './no-ongoing-game-guard';
import { GameService } from 'src/app/components/home/main-screen/services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NoOngoingGameGuard', () => {
  let guard: NoOngoingGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoOngoingGameGuard,
        { provide: GameService, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
    });
    guard = TestBed.get(NoOngoingGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
