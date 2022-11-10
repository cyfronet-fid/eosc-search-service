import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsWithPaginationComponent } from './results-with-pagination.component';
import { PaginationComponent } from './pagination.component';
import { ResultComponent } from './result.component';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ColoredTagsModule } from '../../layouts/colored-tags/colored-tags.module';
import { TagsModule } from '../../layouts/tags/tags.module';
import { UrlTitleModule } from '../../layouts/url-title/url-title.module';

@NgModule({
  declarations: [
    ResultsWithPaginationComponent,
    PaginationComponent,
    ResultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzEmptyModule,
    NzSkeletonModule,
    ColoredTagsModule,
    TagsModule,
    UrlTitleModule,
  ],
  exports: [ResultsWithPaginationComponent],
})
export class ResultsWithPaginationModule {}
