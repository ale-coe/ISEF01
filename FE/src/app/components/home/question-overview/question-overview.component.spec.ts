import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MockComponent } from 'ng-mocks';
import { QuestionService } from '../question/services/question.service';
import { QuestionOverviewComponent } from './question-overview.component';

describe('QuestionOverviewComponent', () => {
  let component: QuestionOverviewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionOverviewComponent, MockComponent(MatPaginator)],
      providers: [
        { provide: QuestionService, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
    });

    const fixture = TestBed.createComponent<QuestionOverviewComponent>(
      QuestionOverviewComponent
    );
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
