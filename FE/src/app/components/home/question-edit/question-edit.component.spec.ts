import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MockComponent } from 'ng-mocks';
import { QuestionComponent } from '../question/question.component';
import { QuestionService } from '../question/services/question.service';
import { QuestionEditComponent } from './question-edit.component';

describe('QuestionEditComponent', () => {
  let component: QuestionEditComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionEditComponent,
        MockComponent(MatPaginator),
        MockComponent(QuestionComponent),
      ],
      providers: [{ provide: QuestionService, useValue: {} }],
    });

    const fixture = TestBed.createComponent<QuestionEditComponent>(
      QuestionEditComponent
    );
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
