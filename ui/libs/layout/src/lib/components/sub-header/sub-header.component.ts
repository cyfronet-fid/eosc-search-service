import {Component, Input,} from '@angular/core';
import {ISet,} from '@eosc-search-service/search';

@Component({
  selector: 'ess-sub-header',
  template: `
    <div id="container" class="page-heading">
      <ng-container *ngIf="activeSet !== null">
        <h3>{{ activeSet.title }}</h3>
        <span id="results-count" class="text-secondary" i18n
          >(around {{ resultsCount }} results)</span
        >
        <div id="breadcrumbs">
          <nz-breadcrumb nzSeparator=">">
            <ng-container
              *ngFor="let breadcrumb of activeSet.breadcrumbs; last as $last"
            >
              <nz-breadcrumb-item *ngIf="!$last; else lastRef">
                <a [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
              </nz-breadcrumb-item>
              <ng-template #lastRef>
                <nz-breadcrumb-item>{{ breadcrumb.label }} </nz-breadcrumb-item>
              </ng-template>
            </ng-container>
          </nz-breadcrumb>
        </div>
      </ng-container>
    </div>
  `,

})
export class SubHeaderComponent {
  // resultsCount$ = this._searchService.maxResultsNumber$;
  @Input() activeSet: ISet | null = null;
  @Input() resultsCount: number | null = null;
}
