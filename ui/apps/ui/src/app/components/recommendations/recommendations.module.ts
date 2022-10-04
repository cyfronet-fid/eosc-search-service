import { RecommendationsComponent } from '@components/recommendations/recommendations.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [RecommendationsComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [RecommendationsComponent],
})
export class RecommendationsModule {}
