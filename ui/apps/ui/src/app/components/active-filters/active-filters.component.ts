import { Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';

import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IActiveFilter } from './type';
import { CustomRouter } from '@pages/search-page/custom.router';
import { toActiveFilters } from './utils';

@UntilDestroy()
@Component({
  selector: 'ess-active-filters',
  template: `
    <section
      *ngIf="$any(activeFilters$ | async).length > 0 || (q$ | async) !== '*'"
      class="filters"
    >
      <span
        *ngIf="$any(activeFilters$ | async).length > 0 || (q$ | async) !== '*'"
        id="clear-all-badge"
        class="btn btn-primary"
        style="cursor: pointer"
        (click)="clearAll()"
      >
        Clear all filters
      </span>

      <div class="badge" *ngIf="(q$ | async) !== '*'">
        <span>Searched phrase: </span>
        <span
          ><i>"{{ q$ | async }}" </i></span
        >
        <span class="close-btn btn-primary" (click)="clearQuery()">x</span>
      </div>
      <div class="badge" *ngFor="let activeFilter of activeFilters$ | async">
        <span>{{ activeFilter.label }}: </span>
        <span
          ><i>{{ activeFilter.value }} </i></span
        >
        <span
          class="close-btn btn-primary"
          (click)="removeFilter(activeFilter.filter, activeFilter.value)"
          >x</span
        >
      </div>
    </section>
  `,
})
export class ActiveFiltersComponent {
  activeFilters$: Observable<IActiveFilter[]> = this._customRouter.fqMap$.pipe(
    filter(() => !!this._customRouter.collection()),
    map((fqsMap) => {
      const collection = this._customRouter.collection();
      const filtersConfigs =
        this._filtersConfigsRepository.get(collection).filters;
      return toActiveFilters(fqsMap, filtersConfigs);
    })
  );
  q$ = this._customRouter.q$;

  constructor(
    private _customRouter: CustomRouter,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  removeFilter = (filter: string, value: string) =>
    this._customRouter.removeFilterValueFromUrl(filter, value);
  clearAll = () => this._customRouter.updateQueryParamsInUrl({ fq: [] });
  clearQuery = () => this._customRouter.setQueryInUrl();
}
