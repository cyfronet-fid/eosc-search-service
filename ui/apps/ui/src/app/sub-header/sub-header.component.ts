import { Component } from '@angular/core';
import { map, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

const ALL_CATALOGS_LABEL = 'All catalogs';
const PUBLICATIONS_LABEL = 'Publications';
const TRAININGS_LABEL = 'Trainings';
const SERVICES_LABEL = 'Services';

interface IBreadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'ui-sub-header',
  template: `
    <div id="container">
      <h3>{{ pageTitle }}</h3>
      <span id="results-count" class="text-secondary"
        >(around {{ resultsCount$ | async }} results)</span
      >
      <div id="breadcrumbs">
        <nz-breadcrumb nzSeparator=">">
          <nz-breadcrumb-item
            *ngFor="let breadcrumb of breadcrumbs.slice(0, -1)"
          >
            <a [routerLink]="breadcrumb?.url">{{ breadcrumb?.label }}</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item
            >{{ breadcrumbs.slice(-1)[0]?.label }}
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
  resultsCount$ = of(1000);
  constructor(private _route: ActivatedRoute, private _router: Router) {}

  get pageTitle() {
    switch (this._router.url.split('?')[0]) {
      case '/all':
        return ALL_CATALOGS_LABEL;
      case '/publications':
        return PUBLICATIONS_LABEL;
      case '/trainings':
        return TRAININGS_LABEL;
      case '/services':
        return SERVICES_LABEL;
      default:
        return [];
    }
  }

  get breadcrumbs(): IBreadcrumb[] {
    switch (this._router.url.split('?')[0]) {
      case '/all':
        return [
          {
            label: ALL_CATALOGS_LABEL,
          },
        ];
      case '/publications':
        return [
          {
            label: ALL_CATALOGS_LABEL,
            url: '/',
          },
          {
            label: PUBLICATIONS_LABEL,
          },
        ];
      case '/trainings':
        return [
          {
            label: ALL_CATALOGS_LABEL,
            url: '/',
          },
          {
            label: TRAININGS_LABEL,
          },
        ];
      case '/services':
        return [
          {
            label: ALL_CATALOGS_LABEL,
            url: '/',
          },
          {
            label: SERVICES_LABEL,
          },
        ];
      default:
        return [];
    }
  }
}
