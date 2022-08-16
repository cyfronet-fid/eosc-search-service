import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@eosc-search-service/layout';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { SearchModule } from '@eosc-search-service/search';
import {
  ActiveFiltersComponent,
  FilterMultiselectComponent,
  ResultComponent,
} from './components';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ESSCommonModule } from '@eosc-search-service/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPageComponent } from './search-page.component';
import { SetResolver } from './services/set-resolver.service';

@NgModule({
  declarations: [
    SearchPageComponent,
    FilterMultiselectComponent,
    ResultComponent,
    ActiveFiltersComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    NzEmptyModule,
    ScrollingModule,
    NzListModule,
    NzSkeletonModule,
    NzSpinModule,
    SearchModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        resolve: {
          activeSet: SetResolver,
        },
        path: ':set',
        component: SearchPageComponent,
      },
    ]),
    ESSCommonModule,
  ],
  exports: [SearchPageComponent, FilterMultiselectComponent, ResultComponent],
})
export class SearchPageModule {}
