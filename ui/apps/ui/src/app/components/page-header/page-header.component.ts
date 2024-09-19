/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { Router } from '@angular/router';
import {
  IFilterConfig,
  IFilterConfigUI,
  IFiltersConfig,
  filterUIEntitiesRef,
} from '@collections/repositories/types';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { Observable, combineLatest, debounceTime, filter, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { selectEntities } from '@ngneat/elf-entities';
import { DEFAULT_SCOPE } from '@collections/services/custom-route.service';

@UntilDestroy()
@Component({
  selector: 'ess-page-header',
  template: `
    <div
      id="container-upper"
      class="page-heading"
      *ngIf="this.showGlobalFilters"
    >
      <ng-container *ngFor="let filterConfig of filtersConfigs$ | async">
        <ng-container [ngSwitch]="filterConfig.type">
          <ess-filter-multiselect-dropdown
            class="multiselect-dropdown"
            *ngSwitchCase="'dropdown'"
            [label]="filterConfig.label"
            [filterId]="filterConfig.id"
            [data]="filterConfig.options"
            [isLoading]="!!(isLoading$ | async)"
            [show]="resultsCount > 0 && filterConfig.options.length > 0"
            [tooltipText]="filterConfig.tooltipText"
          ></ess-filter-multiselect-dropdown>
        </ng-container>
      </ng-container>
    </div>
    <div id="container-lower" class="page-heading">
      <div>
        <span id="results-count" i18n>{{ resultsCount }} search results</span>
      </div>
      <ess-download-results-button></ess-download-results-button>
    </div>
  `,
  styles: [
    `
      #container-upper {
        display: flex;
        flex-direction: row;
        justify-content: left;
        align-items: flex-start;
      }

      #container-lower {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input()
  resultsCount!: number;

  activeNavConfig$ = this._navConfigsRepository.activeEntity$;

  filtersConfigs$ = this.selectActiveFilters$();

  isLoading$: Observable<boolean> = this._filtersConfigsRepository.isLoading$;

  scope: string =
    this._route.snapshot.queryParamMap.get('scope') || DEFAULT_SCOPE;

  showGlobalFilters: boolean = this.scope === DEFAULT_SCOPE;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  async goToUrl(url: string | undefined) {
    await this._router.navigate([url], {
      queryParams: {
        fq: [],
        cursor: '*',
      },
      queryParamsHandling: 'merge',
    });
  }

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
}
