import { Component } from '@angular/core';
import { MocksService } from '../mocks.service';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'ui-marketplace-page',
  templateUrl: './marketplace-page.component.html',
})
export class MarketplacePageComponent {
  filters$ = this._searchService.getFilters$();
  categories$ = this._mocksService.getCategories$();
  recommendations$ = this._mocksService.getRecommendations$();
  recommendedResources$ = this._mocksService.getRecommendedResources$();

  constructor(
    private _mocksService: MocksService,
    private _searchService: SearchService
  ) {}
}
