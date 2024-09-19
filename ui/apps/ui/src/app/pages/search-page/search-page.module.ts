import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ReactiveFormsModule } from '@angular/forms';

import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { NavConfigResolver } from '@collections/services/nav-config-resolver.service';
import { HasDefaultQueryParamGuard } from '@collections/services/has-default-query-param.guard';
import { ResultsWithPaginationModule } from '@components/results-with-pagination/results-with-pagination.module';
import { SearchBarModule } from '@components/search-bar/search-bar.module';
import { CollectionsNavigationModule } from '@components/collections-navigation/collections-navigation.module';
import { PageHeaderModule } from '@components/page-header/page-header.module';
import { FiltersModule } from '@components/filters/filters.module';
import { ActiveFiltersModule } from '@components/active-filters/active-filters.module';
import { RecommendationsModule } from '@components/recommendations/recommendations.module';
import { DownloadResultsModule } from '@components/download-results/download-results.module';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackPanelModule } from '@components/feedback-panel/feedback-panel.module';

import { SearchPageComponent } from './search-page.component';
import { ArticlesModule } from '@components/articles/articles.module';

import { RightPanelModule } from '@components/right-panel/right-panel.module';

@NgModule({
  declarations: [SearchPageComponent],
  providers: [NgbActiveModal],
  imports: [
    CommonModule,
    NzEmptyModule,
    ScrollingModule,
    NzListModule,
    NzSkeletonModule,
    NzSpinModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', redirectTo: DEFAULT_COLLECTION_ID },
      {
        path: ':collection',
        component: SearchPageComponent,
        resolve: {
          activeNavConfig: NavConfigResolver,
        },
        canActivate: [HasDefaultQueryParamGuard],
      },
    ]),
    ResultsWithPaginationModule,
    SearchBarModule,
    CollectionsNavigationModule,
    PageHeaderModule,
    FiltersModule,
    ActiveFiltersModule,
    RecommendationsModule,
    DownloadResultsModule,
    FeedbackPanelModule,
    ArticlesModule,
    RightPanelModule,
  ],
  exports: [SearchPageComponent],
})
export class SearchPageModule {}
