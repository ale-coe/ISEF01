import { TestBed } from '@angular/core/testing';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup } from '@angular/material/radio';
import { MockComponent, MockDirective } from 'ng-mocks';
import { QuestionComponent } from './question.component';
import { QuestionService } from './services/question.service';

describe('QuestionComponent', () => {
  let component: QuestionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionComponent,
        MockComponent(MatCard),
        MockComponent(MatFormField),
        MockComponent(MatIcon),
        MockDirective(MatRadioGroup),
        MockDirective(MatCardContent),
        MockDirective(MatLabel),
        MockDirective(MatCardActions),
      ],
      providers: [{ provide: QuestionService, useValue: {} }],
    });

    const fixture =
      TestBed.createComponent<QuestionComponent>(QuestionComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
