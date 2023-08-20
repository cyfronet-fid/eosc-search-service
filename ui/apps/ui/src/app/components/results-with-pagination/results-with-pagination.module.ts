import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsWithPaginationComponent } from './results-with-pagination.component';
import { PaginationComponent } from './pagination.component';
import { ResultComponent } from './result.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ColoredTagsModule } from '../../layouts/colored-tags/colored-tags.module';
import { TagsModule } from '../../layouts/tags/tags.module';
import { UrlTitleModule } from '../../layouts/url-title/url-title.module';
import { SecondaryTagsModule } from '../../layouts/secondary-tags/secondary-tags.module';
import { DescriptionModule } from '../../layouts/description/description.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

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
    SecondaryTagsModule,
    DescriptionModule,
    InteroperabilityGuidelinesPipeModule,
    NgbDropdownModule,
  ],
  exports: [ResultsWithPaginationComponent],
})
export class ResultsWithPaginationModule {}
