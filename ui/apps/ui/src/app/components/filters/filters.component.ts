/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, debounceTime, filter, map } from 'rxjs';
import {
  IFilterConfig,
  IFilterConfigUI,
  IFiltersConfig,
  filterUIEntitiesRef,
} from '@collections/repositories/types';
import { selectEntities } from '@ngneat/elf-entities';

@UntilDestroy()
@Component({
  selector: 'ess-filters',
  template: `
    <section id="filters">
      <h5>Filters</h5>
      <ng-container *ngIf="isResultsEmpty; else showResultsRef">
        <i class="text-muted text-sm" i18n>{{ emptyFiltersMessage }}</i>
      </ng-container>
      <ng-template #showResultsRef>
        <ng-container *ngFor="let filterConfig of filtersConfigs$ | async">
          <ng-container [ngSwitch]="filterConfig.type">
            <ess-filter-multiselect
              *ngSwitchCase="'multiselect'"
              [isLoading]="!!(isLoading$ | async)"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [tooltipText]="filterConfig.tooltipText"
              [options]="filterConfig.options"
              [expandArrow]="filterConfig.expandArrow"
            ></ess-filter-multiselect>

            <ess-filter-checkbox-resource-type
              *ngSwitchCase="'checkbox-resource-type'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
            >
            </ess-filter-checkbox-resource-type>

            <ess-filter-checkbox-status
              *ngSwitchCase="'checkbox-status'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
            >
            </ess-filter-checkbox-status>

            <ess-filter-date-start-end
              *ngSwitchCase="'date-start-end'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
            >
            </ess-filter-date-start-end>

            <ess-filter-date-range
              *ngSwitchCase="'date-range'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
            >
            </ess-filter-date-range>

            <ess-filter-date-year
              *ngSwitchCase="'date-year'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
            >
            </ess-filter-date-year>
            <ess-filter-date-calendar
              *ngSwitchCase="'date-calendar'"
              [label]="filterConfig.label"
              [filter]="filterConfig.filter"
              [tooltipText]="filterConfig.tooltipText"
              [isExpanded]="!filterConfig.defaultCollapsed"
              [expandArrow]="filterConfig.expandArrow"
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
              [expandArrow]="filterConfig.expandArrow"
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
  @Input() isError?: unknown = undefined;

  public emptyFiltersMessage = '';

  isLoading$: Observable<boolean> = this._filtersConfigsRepository.isLoading$;

  filtersConfigs$ = this.selectActiveFilters$();

  selectActiveFilters$(): Observable<(IFilterConfig & IFilterConfigUI)[]> {
    return combineLatest([
      this._route.paramMap.pipe(
        map((paramMap) => paramMap.get('collection')),
        filter((collection) => !!collection)
      ),
      this._filtersConfigsRepository._store$.pipe(
        selectEntities({ ref: filterUIEntitiesRef })
      ),
      this._filtersConfigsRepository._store$.pipe(selectEntities()),
    ]).pipe(
      map(([activeCollectionId, uiOptions, allEntities]: [any, any, any]) => {
        const filterSet: IFiltersConfig | undefined =
          allEntities[activeCollectionId];
        if (filterSet === undefined) {
          return [];
        }
        return filterSet.filters.map((filterConfig) => ({
          ...filterConfig,
          options: uiOptions[filterConfig.id]?.options ?? [],
        }));
      }),
      debounceTime(250)
    );
  }

  public get isResultsEmpty(): boolean {
    if (this.results == null) {
      return false;
    } else if (this.results.length > 0) {
      return false;
    }
    return true;
  }

  constructor(
    private _filtersConfigsRepository: FiltersConfigsRepository, // If needed
    private _route: ActivatedRoute
  ) {}
}
