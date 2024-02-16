import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'src/app/common/guards/logged-in.guard';
import { NoOngoingGameGuard } from 'src/app/common/guards/no-ongoing-game-guard';
import { HomeComponent } from './home.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { QuestionOverviewComponent } from './question-overview/question-overview.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [LoggedInGuard],
    children: [
      { path: '', redirectTo: 'main-screen', pathMatch: 'full' },
      { path: 'main-screen', component: MainScreenComponent },
      {
        path: 'question-overview',
        component: QuestionOverviewComponent,
        canActivate: [NoOngoingGameGuard],
      },
      { path: 'question-edit', component: QuestionEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
