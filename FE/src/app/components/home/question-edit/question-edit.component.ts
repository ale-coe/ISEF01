import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, retry, switchMap, takeUntil } from 'rxjs';
import {
  EInEditState,
  IQuestion,
  QuestionService,
} from '../question/services/question.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
})
export class QuestionEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  questions: IQuestion[] = [];
  unsubscribe = new Subject<void>();
  paginatorDisabled = true;

  constructor(private readonly questionsService: QuestionService) {}

  ngOnInit() {
    this.questionsService.getQuestions(EInEditState.IN_EDIT, 10, 0).subscribe({
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
            EInEditState.IN_EDIT,
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

  updateQuestion(question: IQuestion) {
    this.questionsService
      .updateQuestion(question)
      .pipe(
        switchMap(() =>
          this.questionsService.getQuestions(
            EInEditState.IN_EDIT,
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
      });
  }

  deleteQuestion(id: number) {
    this.questionsService
      .deleteQuestion(id)
      .pipe(
        switchMap(() =>
          this.questionsService.getQuestions(
            EInEditState.IN_EDIT,
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
      });
  }
}
