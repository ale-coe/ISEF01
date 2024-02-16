import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, retry, switchMap, takeUntil } from 'rxjs';
import {
  EInEditState,
  IQuestion,
  QuestionService,
} from '../question/services/question.service';

@Component({
  selector: 'app-question-overview',
  templateUrl: './question-overview.component.html',
  styleUrls: ['./question-overview.component.scss'],
})
export class QuestionOverviewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  paginatorDisabled = true;
  questions: IQuestion[] = [];
  unsubscribe = new Subject<void>();

  constructor(
    private readonly questionsService: QuestionService,
    private readonly matSnackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.questionsService
      .getQuestions(EInEditState.NOT_IN_EDIT, 10, 0)
      .subscribe({
        next: ([result, size]) => {
          this.questions = result;
          this.paginator.length = size;
          this.paginatorDisabled = false;
        },
      });
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        switchMap((p) =>
          this.questionsService.getQuestions(
            EInEditState.NOT_IN_EDIT,
            p.pageSize,
            p.pageIndex * p.pageSize
          )
        ),
        retry(),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: ([result, size]) => {
          this.questions = result;
          this.paginator.length = size;
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  putInEdit(id: number) {
    this.questionsService
      .putInEditMode(id)
      .pipe(
        switchMap(() =>
          this.questionsService.getQuestions(
            EInEditState.NOT_IN_EDIT,
            this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize
          )
        )
      )
      .subscribe({
        next: ([result, size]) => {
          this.questions = result;
          this.paginator.length = size;
        },
        error: (e) => {
          this.matSnackBar.open(
            e?.error?.message || 'Es ist ein unerwarteter Fehler aufgetreten.',
            undefined,
            { duration: 10_000 }
          );
        },
      });
  }
}
