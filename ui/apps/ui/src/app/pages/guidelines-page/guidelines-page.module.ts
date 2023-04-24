import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuidelineDetailPageComponent } from './guideline-detail-page.component';
import { RouterModule } from '@angular/router';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: ':guidelineId',
        component: GuidelineDetailPageComponent,
      },
    ]),
    SearchBarModule,
    BackToSearchBarModule,
  ],
  declarations: [GuidelineDetailPageComponent],
  exports: [GuidelineDetailPageComponent],
})
export class GuidelinesPageModule {}
