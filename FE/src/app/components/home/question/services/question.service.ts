import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface IReasonWrongAnswer {
  id?: number;
  reason: string;
}

export interface IAnswer {
  answer: string;
  id?: number;
  isCorrect: number;
  reasonWrongAnswer: IReasonWrongAnswer | null;
}

export interface IQuestion {
  id?: number;
  question: string;
  inEdit: number;
  answers: IAnswer[];
}

export enum EInEditState {
  NOT_IN_EDIT,
  IN_EDIT,
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  constructor(private readonly httpClient: HttpClient) {}

  getQuestions(inEdit: number, limit: number, offset: number) {
    return this.httpClient.get<[IQuestion[], number]>(
      `${environment.host}/questions`,
      {
        params: { inEdit, limit, offset },
      }
    );
  }

  insertQuestion(question: IQuestion) {
    return this.httpClient.post(`${environment.host}/questions`, question);
  }

  putInEditMode(id: number) {
    return this.httpClient.put(`${environment.host}/questions/${id}/edit`, {});
  }

  updateQuestion(question: IQuestion) {
    return this.httpClient.put(
      `${environment.host}/questions/${question.id}/update`,
      question
    );
  }

  deleteQuestion(id: number) {
    return this.httpClient.delete(`${environment.host}/questions/${id}`);
  }
}
