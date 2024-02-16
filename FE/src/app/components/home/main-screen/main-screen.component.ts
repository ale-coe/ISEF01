import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, switchMap, take } from 'rxjs';
import { GameDialogComponent } from './game-dialog/game-dialog.component';
import { GameService, IGameResponse } from './services/game.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.scss'],
})
export class MainScreenComponent implements OnInit {
  ongoingGames: IGameResponse[] = [];
  doneGames: IGameResponse[] = [];
  ownName!: string;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly gameService: GameService,
    private readonly cookieService: CookieService
  ) {}

  ngOnInit() {
    this.ownName = this.cookieService.get('username');

    forkJoin([
      this.gameService.getOngoingGames(),
      this.gameService.getDoneGames(),
    ]).subscribe({
      next: ([onGoing, done]) => {
        this.ongoingGames = onGoing;
        this.doneGames = done;
      },
    });
  }

  openGameDialog(isCoop: number) {
    const ref = this.matDialog.open(GameDialogComponent, {
      data: { gameId: null, title: 'Spiel starten', isCoop },
      autoFocus: false,
      width: '70vw',
      height: '70vh',
      disableClose: true,
    });

    this.handleDialogClose(ref);
  }

  continueGame(gameId: number, isCoop: number) {
    const ref = this.matDialog.open(GameDialogComponent, {
      data: { gameId, title: 'Viel Erfolg', isCoop },
      autoFocus: false,
      width: '70vw',
      height: '70vh',
      disableClose: true,
    });

    this.handleDialogClose(ref);
  }

  handleDialogClose(ref: MatDialogRef<GameDialogComponent>) {
    ref
      .afterClosed()
      .pipe(
        switchMap(() =>
          forkJoin([
            this.gameService.getOngoingGames(),
            this.gameService.getDoneGames(),
          ])
        ),
        take(1)
      )
      .subscribe({
        next: ([onGoing, done]) => {
          this.ongoingGames = onGoing;
          this.doneGames = done;
        },
      });
  }
}
