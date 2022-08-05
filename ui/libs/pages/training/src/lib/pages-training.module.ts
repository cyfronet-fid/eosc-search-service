import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingDetailPageComponent } from './pages/training-detail-page/training-detail-page.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@eosc-search-service/layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'trainings/:trainingId',
        component: TrainingDetailPageComponent,
      },
    ]),
    LayoutModule,
  ],
  declarations: [TrainingDetailPageComponent],
  exports: [TrainingDetailPageComponent],
})
export class TrainingPagesModule {}
