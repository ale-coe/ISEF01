import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs';
import { GameService } from 'src/app/components/home/main-screen/services/game.service';

@Injectable({ providedIn: 'root' })
export class NoOngoingGameGuard {
  constructor(
    private readonly gameService: GameService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  canActivate() {
    return this.gameService.getOngoingGames().pipe(
      map((r) => !r.length),
      tap((r) => {
        if (!r) {
          this.matSnackBar.open(
            'Beende alle aktiven Spiele, bevor du auf die Übersichtsseite kannst.',
            undefined,
            { duration: 10_000 }
          );
        }
      })
    );
  }
}
