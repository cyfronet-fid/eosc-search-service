import { Component } from '@angular/core';
import { MocksService } from './mocks.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'ui-root',
  template: `
    <ui-main-header></ui-main-header>
    <div class="container--xxl">
      <ui-search></ui-search>
      <div class="dashboard">
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
          <ng-container *ngFor="let label of labels$ | async">
            <div class="col">
              <a
                [routerLink]="getLabelUrl(label.label)"
                queryParamsHandling="merge"
                class="dashboard__label"
                >{{ label.label }}&nbsp;<strong
                  >{{ label.count }} results</strong
                ></a
              >
            </div>
          </ng-container>
        </div>
        <br /><br /><br />
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {
  labels$ = this._mocksService.getLabels$();
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

  constructor(
    private _mocksService: MocksService,
    private _route: ActivatedRoute
  ) {}

  // TODO: Provide identifiers in backend for each label available
  getLabelUrl(label: string) {
    switch (label.toLowerCase()) {
      case 'marketplace':
        return ['/marketplace'];
      case 'research outcomes':
        return ['/articles'];
      default:
        return ['/'];
    }
  }
}
