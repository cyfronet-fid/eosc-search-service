import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { IFiltersConfig } from '@collections/repositories/types';

@UntilDestroy()
@Component({
  selector: 'ess-filters',
  template: `
    <section id="filters">
      <h5>Filters</h5>
      <ng-container *ngIf="isResultsEmpty; else showResultsRef">
        <i class="text-muted text-sm" i18n
          >No filters are available as there is no data to be filtered</i
        >
      </ng-container>
      <ng-template #showResultsRef>
        <ng-container *ngFor="let filterConfig of filtersConfigs$ | async">
          <ng-container [ngSwitch]="filterConfig.type">
            <ess-filter-multiselect
              *ngSwitchCase="'multiselect'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [tooltipText]="filterConfig.tooltipText"
              [onValuesFetch]="filterConfig.onFacetsFetch"
              [customSort]="filterConfig.customSort"
            ></ess-filter-multiselect>
            <ess-filter-date-year
              *ngSwitchCase="'date-year'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
            >
            </ess-filter-date-year>
            <ess-filter-date-calendar
              *ngSwitchCase="'date-calendar'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
            >
            </ess-filter-date-calendar>
          </ng-container>
          <ng-container [ngSwitch]="filterConfig.type">
            <ess-filter-range
              *ngSwitchCase="'range'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
            ></ess-filter-range>
          </ng-container>
        </ng-container>
      </ng-template>
    </section>
  `,
  styles: [],
})
export class FiltersComponent {
  @Input() results?: unknown[] = undefined;
  filtersConfigs$ = this._route.paramMap.pipe(
    filter((paramMap) => !!paramMap.get('collection')),
    map((paramMap) => {
      const filtersConfigs = this._filtersConfigsRepository.get(
        paramMap.get('collection')
      ) as IFiltersConfig;
      return filtersConfigs.filters;
    })
  );

  public get isResultsEmpty(): boolean {
    if (this.results == null) {
      return false;
    } else if (this.results.length > 0) {
      return false;
    }
    return true;
  }

  constructor(
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _route: ActivatedRoute
  ) {}
}
