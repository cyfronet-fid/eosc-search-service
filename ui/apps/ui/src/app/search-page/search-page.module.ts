import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './search-page.component';
import { CategoriesModule, MainHeaderModule, SearchModule } from '@ui/core';
import { ResultModule } from '../result/result.module';
import { TrainingServiceModule } from '../training-service/training-service.module';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { FiltersModule } from '../filters/filters.module';
import { SubNavModule } from '../sub-nav/sub-nav.module';
import { SubHeaderModule } from '../sub-header/sub-header.module';

@NgModule({
  declarations: [SearchPageComponent],
  imports: [
    CommonModule,
    CategoriesModule,
    ResultModule,
    TrainingServiceModule,
    NzEmptyModule,
    ScrollingModule,
    NzListModule,
    NzSkeletonModule,
    FiltersModule,
    SubNavModule,
    SubHeaderModule,
    MainHeaderModule,
    SearchModule,
  ],
})
export class SearchPageModule {}
