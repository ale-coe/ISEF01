import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  GameService,
  IQuestionResponse,
  TAnswerResult,
} from '../services/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-game-dialog',
  templateUrl: './game-dialog.component.html',
  styleUrls: ['./game-dialog.component.scss'],
})
export class GameDialogComponent implements OnInit, OnDestroy {
  selectBtnsDisabled = false;
  showNextBtn = false;
  showWaitMessage = false;
  gameId!: number;
  title!: string;
  result = '';
  reason = '';
  currentQuestion?: IQuestionResponse;
  answerFormControl = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true,
  });
  formgroup = new FormGroup({
    messageFormControl: new FormControl(
      { value: '', disabled: true },
      { nonNullable: true, updateOn: 'submit' }
    ),
  });
  messages: { message: string; own: boolean }[] = [];
  isCoop!: number;
  socket!: Socket;
  unsubscribe = new Subject<void>();
  playerLeft = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { gameId: number | null; title: string; isCoop: number },
    private readonly gameService: GameService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    this.isCoop = this.data.isCoop;
    this.gameId = this.data.gameId || -1;

    if (this.gameId < 0) {
      return;
    }

    if (this.isCoop) {
      this.showWaitMessage = true;

      this.socket = this.getSocket();
      this.listenToEvents();
      this.socket.emit('resume-game', this.gameId);
    } else {
      this.gameService
        .getCurrentQuestion(this.gameId)
        .subscribe({ next: this.handleCurrentQuestion.bind(this) });
    }
  }

  ngOnDestroy(): void {
    this.socket?.disconnect();
  }

  getSocket() {
    return (
      this.socket ||
      new Socket({
        url: `${environment.ws}`,
        options: { withCredentials: true },
      })
    );
  }

  waitForCoopGame() {
    this.showWaitMessage = true;
    this.selectBtnsDisabled = true;
    this.isCoop = 1;
    this.socket = this.getSocket();

    this.listenToEvents();
    this.socket.emit('join-lobby');
  }

  listenToEvents() {
    this.socket!.fromEvent<string>('error')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (message) => {
          this.matSnackBar.open(
            message || 'Es ist ein unerwarteter Fehler aufgetreten.',
            undefined,
            { duration: 10_000 }
          );
        },
      });

    this.socket!.fromEvent<string>('chat')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (message) => {
          this.messages.push({ message, own: false });
        },
      });

    this.socket!.fromEvent<number>('game-start')
      .pipe(take(1))
      .subscribe({
        next: (gameId) => {
          this.showWaitMessage = false;
          this.gameId = gameId;
          this.title = 'Viel Erfolg';
          this.formgroup.enable();
        },
      });

    this.socket!.fromEvent<IQuestionResponse>('current-question')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: this.handleCurrentQuestion.bind(this),
      });

    this.socket!.fromEvent<TAnswerResult>('question-answered')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: this.handleQuestionAnswered.bind(this),
      });

    this.socket!.fromEvent<IQuestionResponse>('player-left')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.playerLeft = true;
          this.socket!.disconnect();
        },
      });
  }

  sendMessage() {
    const message = this.formgroup.value.messageFormControl!;
    this.messages.push({ message, own: true });
    this.formgroup.reset();
    this.socket?.emit('chat', message);
  }

  startCompGame() {
    this.selectBtnsDisabled = true;
    this.isCoop = 0;

    this.gameService
      .startCompGame(0)
      .pipe(
        tap((gameId) => {
          this.gameId = gameId;
          this.title = 'Viel Erfolg';
        }),
        switchMap(() => this.gameService.getCurrentQuestion(this.gameId))
      )
      .subscribe({
        next: this.handleCurrentQuestion.bind(this),
        error: (e) => {
          this.matSnackBar.open(
            e?.error?.message || 'Es ist ein unerwarteter Fehler aufgetreten.',
            undefined,
            { duration: 10_000 }
          );
        },
      });
  }

  sendAnswer() {
    this.answerFormControl.disable();

    if (this.isCoop) {
      this.socket!.emit('answer-question', {
        gameId: this.gameId,
        answer: this.answerFormControl.value,
      });
      return;
    }

    this.gameService
      .answerQuestion(this.gameId, this.answerFormControl.value)
      .subscribe({
        next: this.handleQuestionAnswered.bind(this),
      });
  }

  handleQuestionAnswered([
    lastQuestion,
    orignalAnswer,
    correctAnswer,
    reason,
  ]: TAnswerResult) {
    // just for coop games: set answer for player who didnt answer
    this.answerFormControl.setValue(orignalAnswer);
    this.answerFormControl.disable();

    if (correctAnswer) {
      this.result = `Das war falsch, die korrekte Antwort lautet ${correctAnswer}.`;
      this.reason = `Begründung: ${reason || '-'}`;
    } else {
      this.result = 'Das war korrekt!';
    }

    if (lastQuestion) {
      this.matSnackBar.open(
        this.isCoop
          ? 'Ihr habt alle Fragen beantwortet.'
          : 'Du hast alle Fragen beantwortet.',
        undefined,
        {
          duration: 10_000,
        }
      );
    } else {
      this.showNextBtn = true;
    }
  }

  handleCurrentQuestion(question: IQuestionResponse) {
    this.result = '';
    this.reason = '';
    this.answerFormControl.reset();
    this.currentQuestion = question;
    this.answerFormControl.enable();
  }

  getCurrentQuestion() {
    this.showNextBtn = false;

    if (this.isCoop) {
      this.socket!.emit('current-question', this.gameId);
      return;
    }

    this.gameService.getCurrentQuestion(this.gameId).subscribe({
      next: this.handleCurrentQuestion.bind(this),
    });
  }
}
