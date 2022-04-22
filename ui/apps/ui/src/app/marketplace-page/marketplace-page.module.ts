import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplacePageComponent } from './marketplace-page.component';
import { ResourcesComponent } from './resources.component';
import { ResourceComponent } from './resource.component';
import { RecommendationsComponent } from './recommendations.component';
import { RecommendationComponent } from './recommendation.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesModule, VerticalFitlersModule } from '@ui/core';

@NgModule({
  declarations: [
    MarketplacePageComponent,
    ResourcesComponent,
    ResourceComponent,
    RecommendationsComponent,
    RecommendationComponent,
  ],
  imports: [
    CommonModule,
    NgbRatingModule,
    VerticalFitlersModule,
    CategoriesModule,
  ],
})
export class MarketplacePageModule {}
