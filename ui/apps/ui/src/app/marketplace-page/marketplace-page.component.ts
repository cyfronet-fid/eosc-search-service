import { Component } from '@angular/core';
import { MocksService } from '../mocks.service';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'ui-marketplace-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <core-categories [categories]="categories$ | async"></core-categories>
        <section class="dashboard__filter">
          <h5>Filter by</h5>
          <core-multiselect-with-search
            *ngFor="let filter of filters$ | async"
            [filter]="filter"
          >
          </core-multiselect-with-search>
        </section>
      </div>
      <div class="col-9">
        <ui-recommendations
          [recommendations]="recommendations$ | async"
        ></ui-recommendations>
        <ui-resources [resources]="resources$ | async"></ui-resources>
      </div>
    </div>
  `,
})
export class MarketplacePageComponent {
  filters$ = this._searchService.getFilters$();
  categories$ = this._mocksService.getCategories$();
  recommendations$ = this._mocksService.getRecommendations$();
  resources$ = this._mocksService.getResources$();

  constructor(
    private _mocksService: MocksService,
    private _searchService: SearchService
  ) {}
}
