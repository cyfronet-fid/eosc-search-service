import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplacePageComponent } from './marketplace-page.component';
import { ResourcesComponent } from './resources.component';
import { ResourceComponent } from './resource.component';
import { RecommendationsComponent } from './recommendations.component';
import { RecommendationComponent } from './recommendation.component';
import { CategoriesComponent } from './categories.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { VerticalFitlersModule } from '@ui/core';

@NgModule({
  declarations: [
    MarketplacePageComponent,
    CategoriesComponent,
    ResourcesComponent,
    ResourceComponent,
    RecommendationsComponent,
    RecommendationComponent,
  ],
  imports: [CommonModule, NgbRatingModule, VerticalFitlersModule],
})
export class MarketplacePageModule {}
