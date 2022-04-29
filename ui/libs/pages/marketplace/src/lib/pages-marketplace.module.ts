import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MarketplacePageComponent} from "./pages/marketplace-page/marketplace-page.component";
import {ResourceListComponent} from "./pages/marketplace-page/resource-list.component";
import {ResourceComponent} from "./pages/marketplace-page/resource.component";
import {RecommendationListComponent} from "./pages/marketplace-page/recommendation-list.component";
import {RecommendationComponent} from "./pages/marketplace-page/recommendation.component";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {LayoutModule} from "@eosc-search-service/layout";

@NgModule({
  declarations: [
    MarketplacePageComponent,
    ResourceListComponent,
    ResourceComponent,
    RecommendationListComponent,
    RecommendationComponent,
  ],
  imports: [
    CommonModule,
    NgbRatingModule,
    LayoutModule,
    RouterModule.forChild([
      { path: 'marketplace', component: MarketplacePageComponent }
    ])
  ],
  exports: [
    MarketplacePageComponent,
    ResourceListComponent,
    ResourceComponent,
    RecommendationListComponent,
    RecommendationComponent,
  ]
})
export class PagesMarketplaceModule {}
