import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchService } from '../search-service/search.service';
import { filter, map } from 'rxjs';
import { TrainingService } from '../training-service/training.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ui-sub-header',
  template: `
    <div id="container">
      <h3>{{ (set$ | async)?.title }}</h3>
      <span id="results-count" class="text-secondary"
        >(around {{ resultsCount$ | async }} results)</span
      >
      <div id="breadcrumbs">
        <nz-breadcrumb nzSeparator=">">
          <nz-breadcrumb-item
            *ngFor="
              let breadcrumb of $any(set$ | async)?.breadcrumbs?.slice(0, -1)
            "
          >
            <a [routerLink]="breadcrumb?.url">{{ breadcrumb?.label }}</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item
            >{{ $any(set$ | async)?.breadcrumbs?.slice(-1)[0]?.label }}
          </nz-breadcrumb-item>
        </nz-breadcrumb>
      </div>
    </div>
  `,
  styles: [
    `
      #container {
        margin-top: 20px;
      }
      #results-count {
        padding-left: 10px;
      }
      h3,
      #results-count {
        display: inline;
      }
      #breadcrumbs {
        padding: 5px 0 15px;
      }
    `,
  ],
})
export class SubHeaderComponent {
  resultsCount$ = this._searchService.maxResultsNumber$;
  set$ = this._router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => (event as NavigationEnd)?.url?.split('?')[0]),
    map((urlPath: string) =>
      environment.search.sets.find((set) => urlPath.endsWith(set.urlPath))
    )
  );

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _searchService: SearchService,
    private _trainingsService: TrainingService
  ) {}
}
