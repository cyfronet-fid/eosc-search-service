import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidelineDetailPageComponent } from './guideline-detail-page.component';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { FeedbackPanelModule } from '@components/feedback-panel/feedback-panel.module';
import { IgServicesCardModule } from '../../layouts/ig-services-card/ig-services-card.module';

@NgModule({
  imports: [
    CommonModule,
    InteroperabilityGuidelinesPipeModule,
    IgServicesCardModule,
    RouterModule.forChild([
      {
        path: ':guidelineId',
        component: GuidelineDetailPageComponent,
      },
    ]),
    SearchBarModule,
    BackToSearchBarModule,
    FeedbackPanelModule,
  ],
  declarations: [GuidelineDetailPageComponent],
  exports: [GuidelineDetailPageComponent],
})
export class GuidelinesPageModule {}
