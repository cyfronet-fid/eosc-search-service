import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ess-sub-header',
  template: `
    <div id="dashboard__header">
      <div id="header__search-phrase">
        <p class="text-secondary">SEARCH RESULTS FOR:</p>
        <h3>Searched phrase: {{ searchedValue$ | async }}</h3>
      </div>
      <button type="button" id="dahboard__header-btn">
        Switch to recommended results only
      </button>
    </div>
    <div class="row gx-5" id="dashboard__labels">
      <div class="col">
        <a
          routerLink="marketplace"
          routerLinkActive="active-link"
          queryParamsHandling="merge"
          class="dashboard__label"
          >Marketplace&nbsp;<strong>148 results</strong></a
        >
      </div>
      <div class="col">
        <a
          routerLink="articles"
          routerLinkActive="active-link"
          queryParamsHandling="merge"
          class="dashboard__label"
          >Research outcomes&nbsp;<strong>2053 results</strong></a
        >
      </div>
      <div class="col">
        <a
          routerLink="training-catalog"
          routerLinkActive="active-link"
          queryParamsHandling="merge"
          class="dashboard__label"
          >Training Catalog &nbsp;<strong>148 results</strong></a
        >
      </div>
      <div class="col">
        <a routerLink="" queryParamsHandling="merge" class="dashboard__label"
          >Organisations&nbsp;<strong>148 results</strong></a
        >
      </div>
    </div>
  `,
})
export class SubHeaderComponent {
  searchedValue$ = this._route.queryParams.pipe(
    map((params) => {
      switch (params['q']) {
        case '*':
          return 'all available';
        case undefined:
        case null:
          return 'nothing';
        default:
          return params['q'];
      }
    })
  );

  constructor(private _route: ActivatedRoute) {}
}
