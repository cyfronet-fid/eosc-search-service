import { Component } from '@angular/core';
import {MocksService} from "@eosc-search-service/common";
import {SearchService} from "@eosc-search-service/search";

@Component({
  selector: 'ess-marketplace-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <ess-category-list [categories]="(categories$ | async) ?? []"></ess-category-list>
        <section class="dashboard__filter">
          <h5>Filter by</h5>
          <ess-multiselect-with-search
            *ngFor="let filter of filters$ | async"
            [filter]="filter"
          >
          </ess-multiselect-with-search>
        </section>
      </div>
      <div class="col-9">
        <ess-recommendation-list
          [recommendations]="recommendations$ | async"
        ></ess-recommendation-list>
        <ess-resource-list [resources]="resources$ | async"></ess-resource-list>
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
