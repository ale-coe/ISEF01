import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IUser {
  mail: string;
}

export interface IGameUser {
  correct: number;
  incorrect: number;
  user: IUser;
}

export interface IGameResponse {
  id: number;
  isCoop: number;
  gameUser: IGameUser[];
}

interface IAnswer {
  answer: string;
}

export interface IQuestionResponse {
  question: string;
  answers: IAnswer[];
}

export type TAnswerResult = [boolean, string, string, string];

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private readonly httpClient: HttpClient) {}

  getOngoingGames() {
    return this.httpClient.get<IGameResponse[]>(
      `${environment.host}/game/ongoing`
    );
  }

  getDoneGames() {
    return this.httpClient.get<IGameResponse[]>(
      `${environment.host}/game/done`
    );
  }

  startCompGame(isCoop: number) {
    return this.httpClient.post<number>(`${environment.host}/game/start-comp`, {
      isCoop,
    });
  }

  getCurrentQuestion(gameId: number) {
    return this.httpClient.get<IQuestionResponse>(
      `${environment.host}/game/${gameId}/current-question`
    );
  }

  answerQuestion(gameId: number, answer: string) {
    return this.httpClient.put<TAnswerResult>(
      `${environment.host}/game/${gameId}/answer-question`,
      { answer }
    );
  }
}
