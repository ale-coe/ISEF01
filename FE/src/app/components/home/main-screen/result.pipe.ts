import { Pipe, PipeTransform } from '@angular/core';
import { IGameResponse } from './services/game.service';

@Pipe({ name: 'result' })
export class ResultPipe implements PipeTransform {
  transform(game: IGameResponse, ownName: string, isCoop: number) {
    const answeredQuestions = game.gameUser.reduce(
      (prev, curr) => prev + curr.correct + curr.incorrect,
      0
    );

    if (answeredQuestions < 16) {
      return 'Das Quiz läuft noch.';
    } else if (isCoop) {
      return 'Ihr habt beide gewonnen.';
    }
    const scorep1 = game.gameUser[0].correct;
    const scorep2 = game.gameUser[1].correct;

    if (scorep1 > scorep2) {
      if (game.gameUser[0].user.mail === ownName) {
        return 'Du hast gewonnen';
      }
      return 'Dein Gegner hat gewonnen';
    } else if (scorep1 < scorep2) {
      if (game.gameUser[0].user.mail === ownName) {
        return 'Dein Gegner hat gewonnen';
      }
      return 'Du hast gewonnen';
    }

    return 'Das war ein Unentschieden';
  }
}
