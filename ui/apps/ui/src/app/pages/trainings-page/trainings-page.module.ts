import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingDetailPageComponent } from './training-detail-page.component';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '../../components/search-bar/search-bar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':trainingId',
        component: TrainingDetailPageComponent,
      },
    ]),
    SearchBarModule,
  ],
  declarations: [TrainingDetailPageComponent],
  exports: [TrainingDetailPageComponent],
})
export class TrainingsPageModule {}
