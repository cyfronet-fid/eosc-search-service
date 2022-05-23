import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchPageComponent } from './pages';
import { LayoutModule } from '@eosc-search-service/layout';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { SearchModule } from '@eosc-search-service/search';
import {ActiveFiltersComponent, FiltersComponent} from './components';
import { ResultComponent } from './components/result/result.component';
import { SetResolver } from './services';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [SearchPageComponent, FiltersComponent, ResultComponent, ActiveFiltersComponent],
  imports: [
    CommonModule,
    LayoutModule,
    NzEmptyModule,
    ScrollingModule,
    NzListModule,
    NzSkeletonModule,
    NzSpinModule,
    SearchModule,
    RouterModule.forChild([
      {
        resolve: {
          activeSet: SetResolver
        },
        path: 'search/:set',
        component: SearchPageComponent,
      }
    ]),
  ],
  exports: [SearchPageComponent, FiltersComponent, ResultComponent],
})
export class SearchPageModule {
}
