import { TestBed } from '@angular/core/testing';
import { GameDialogComponent } from './game-dialog.component';
import { GameService } from '../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MockComponent, MockDirective } from 'ng-mocks';
import { MatIcon } from '@angular/material/icon';

describe('GameDialogComponent', () => {
  let component: GameDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameDialogComponent,
        MockComponent(MatIcon),
        MockDirective(MatDialogContent),
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { title: '', isCoop: 1, gameId: 1 },
        },
        { provide: GameService, useValue: {} },
        { provide: MatSnackBar, useValue: MatSnackBar },
      ],
    });

    const fixture =
      TestBed.createComponent<GameDialogComponent>(GameDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
