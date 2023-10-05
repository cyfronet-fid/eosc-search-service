import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingDetailPageComponent } from './training-detail-page.component';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { FeedbackPanelModule } from '@components/feedback-panel/feedback-panel.module';

@NgModule({
  imports: [
    CommonModule,
    InteroperabilityGuidelinesPipeModule,
    RouterModule.forChild([
      {
        path: ':trainingId',
        component: TrainingDetailPageComponent,
      },
    ]),
    SearchBarModule,
    BackToSearchBarModule,
    FeedbackPanelModule,
  ],
  declarations: [TrainingDetailPageComponent],
  exports: [TrainingDetailPageComponent],
})
export class TrainingsPageModule {}
