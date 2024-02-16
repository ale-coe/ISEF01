import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  EInEditState,
  IQuestion,
  QuestionService,
} from './services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() question?: IQuestion;
  @Output() putInEdit$ = new EventEmitter<number>();
  @Output() updateQuestion$ = new EventEmitter<IQuestion>();
  @Output() deleteQuestion$ = new EventEmitter<number>();

  formGroup!: FormGroup;
  answerFormArray!: FormArray;
  correctAnswerFormControl!: FormControl;
  unsubscribe = new Subject<void>();

  constructor(private readonly questionsService: QuestionService) {}

  ngOnInit() {
    this.question
      ? this.handleExisitngQuestion(this.question)
      : this.handleNewQuestion();

    this.correctAnswerFormControl.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (newIndex) => {
          for (let i = 0; i < this.answerFormArray.controls.length; i++) {
            const formControl = this.answerFormArray
              .at(i)
              .get('reasonFormControl') as FormControl;

            if (newIndex === i) {
              formControl.setValue('', { emitEvent: false });
              formControl.disable({ emitEvent: false });
            } else {
              formControl.enable({ emitEvent: false });
            }
          }
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  handleNewQuestion() {
    this.correctAnswerFormControl = new FormControl(-1, [
      Validators.required,
      Validators.min(0),
    ]);
    this.answerFormArray = new FormArray(
      Array(4)
        .fill(null)
        .map(
          () =>
            new FormGroup({
              answerFormControl: new FormControl(
                {
                  value: '',
                  disabled: false,
                },
                { validators: [Validators.required] }
              ),
              reasonFormControl: new FormControl({
                value: '',
                disabled: false,
              }),
            })
        )
    );

    this.formGroup = new FormGroup({
      questionFormControl: new FormControl('', {
        validators: [Validators.required],
      }),
      correctAnswerFormControl: this.correctAnswerFormControl,
      answerFormArray: this.answerFormArray,
    });
  }

  handleExisitngQuestion(question: IQuestion) {
    const correctAnswerIndex = this.question!.answers.findIndex(
      ({ isCorrect }) => isCorrect
    )!;
    this.correctAnswerFormControl = new FormControl(correctAnswerIndex, [
      Validators.required,
    ]);
    this.answerFormArray = new FormArray(
      question.answers.map(
        (answer) =>
          new FormGroup({
            answerFormControl: new FormControl(
              {
                value: answer.answer,
                disabled: false,
              },
              { validators: [Validators.required] }
            ),
            reasonFormControl: new FormControl({
              value: answer.reasonWrongAnswer?.reason || '',
              disabled: !!answer.isCorrect,
            }),
          })
      )
    );

    this.formGroup = new FormGroup({
      questionFormControl: new FormControl(this.question?.question, {
        validators: [Validators.required],
      }),
      correctAnswerFormControl: this.correctAnswerFormControl,
      answerFormArray: this.answerFormArray,
    });

    if (!question.inEdit) {
      this.formGroup.disable();
    }
  }

  putInEdit() {
    this.putInEdit$.emit(this.question!.id);
  }

  deleteGateSave() {
    this.question ? this.updateQuestion(this.question) : this.insertQuestion();
  }

  insertQuestion() {
    const value = this.formGroup.getRawValue();

    const newQuestion: IQuestion = {
      question: value.questionFormControl,
      inEdit: EInEditState.NOT_IN_EDIT,
      answers: (value.answerFormArray as Array<any>).map((_e, i) => ({
        answer: value.answerFormArray[i].answerFormControl,
        isCorrect: i === value.correctAnswerFormControl ? 1 : 0,
        reasonWrongAnswer: {
          reason: value.answerFormArray[i].reasonFormControl || '',
        },
      })),
    };

    this.questionsService.insertQuestion(newQuestion).subscribe({
      next: () => {
        this.formGroup.reset();
      },
    });
  }

  updateQuestion(question: IQuestion) {
    const value = this.formGroup.getRawValue();

    const updatedQuestion: IQuestion = {
      id: question.id,
      question: value.questionFormControl,
      inEdit: EInEditState.NOT_IN_EDIT,
      answers: question.answers.map(({ id, reasonWrongAnswer }, i) => ({
        id: id as number,
        answer: value.answerFormArray[i].answerFormControl,
        isCorrect: i === value.correctAnswerFormControl ? 1 : 0,
        reasonWrongAnswer: {
          id: reasonWrongAnswer?.id ?? undefined,
          reason: value.answerFormArray[i].reasonFormControl,
        },
      })),
    };

    this.updateQuestion$.emit(updatedQuestion);
  }

  deleteQuestion() {
    this.deleteQuestion$.emit(this.question!.id);
  }
}
