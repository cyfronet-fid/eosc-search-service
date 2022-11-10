import { RecommendationsComponent } from '@components/recommendations/recommendations.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsModule } from '../../layouts/tags/tags.module';
import { ColoredTagsModule } from '../../layouts/colored-tags/colored-tags.module';
import { UrlTitleModule } from '../../layouts/url-title/url-title.module';

@NgModule({
  declarations: [RecommendationsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    TagsModule,
    ColoredTagsModule,
    UrlTitleModule,
  ],
  exports: [RecommendationsComponent],
})
export class RecommendationsModule {}
