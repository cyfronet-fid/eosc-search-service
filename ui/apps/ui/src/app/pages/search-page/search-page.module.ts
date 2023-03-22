import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPageComponent } from './search-page.component';

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
import { InteroperabilityModule } from '@components/interoperatibility/interoperability.module';

@NgModule({
  declarations: [SearchPageComponent],
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
    InteroperabilityModule,
  ],
})
export class SearchPageModule {}
