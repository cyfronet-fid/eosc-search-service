import { RecommendationsComponent } from '@components/recommendations/recommendations.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsModule } from '../../layouts/tags/tags.module';
import { ColoredTagsModule } from '../../layouts/colored-tags/colored-tags.module';
import { UrlTitleModule } from '../../layouts/url-title/url-title.module';
import { DescriptionModule } from '../../layouts/description/description.module';
import { SecondaryTagsModule } from '../../layouts/secondary-tags/secondary-tags.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [RecommendationsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TagsModule,
    ColoredTagsModule,
    UrlTitleModule,
    DescriptionModule,
    SecondaryTagsModule,
    InteroperabilityGuidelinesPipeModule,
    NgbTooltipModule,
  ],
  exports: [RecommendationsComponent],
})
export class RecommendationsModule {}
