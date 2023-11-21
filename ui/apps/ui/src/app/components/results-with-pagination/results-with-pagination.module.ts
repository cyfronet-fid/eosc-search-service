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
import { BibliographyModule } from '@components/bibliography/bibliography.module';
import { PinComponent } from '@components/results-with-pagination/result-ui-controls/pin.component';
import { PinStaticComponent } from '@components/results-with-pagination/result-ui-controls/pin-static.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SourcesComponent } from './result-ui-controls/sources.component';
import { PageHeaderModule } from '@components/page-header/page-header.module';

@NgModule({
  declarations: [
    ResultsWithPaginationComponent,
    PaginationComponent,
    ResultComponent,
    PinComponent,
    PinStaticComponent,
    SourcesComponent,
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
    BibliographyModule,
    NzButtonModule,
    PageHeaderModule,
  ],
  exports: [ResultsWithPaginationComponent],
})
export class ResultsWithPaginationModule {}
