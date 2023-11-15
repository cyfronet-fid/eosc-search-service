import { Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';

import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IActiveFilter } from './type';
import { CustomRoute } from '@collections/services/custom-route.service';
import { toActiveFilters } from './utils';
import { Router } from '@angular/router';
import { removeFilterValue } from '@collections/filters-serializers/filters-serializers.utils';

@UntilDestroy()
@Component({
  selector: 'ess-active-filters',
  template: `
    <section *ngIf="$any(activeFilters$ | async)?.length > 0" class="filters">
      <span
        *ngIf="$any(activeFilters$ | async).length > 0"
        id="clear-all-badge"
        class="btn btn-primary"
        style="cursor: pointer"
        (click)="clearAll()"
      >
        Clear filters
      </span>

      <div class="badge" *ngFor="let activeFilter of activeFilters$ | async">
        <span class="{{ activeFilter.label }}">{{ activeFilter.label }}: </span>
        <span>{{
          activeFilter.uiValue | filterPipe: activeFilter.filter
        }}</span>
        <span
          class="close-btn btn-primary"
          (click)="removeFilter(activeFilter.filter, activeFilter.value)"
          >✕</span
        >
      </div>
    </section>
  `,
})
export class ActiveFiltersComponent {
  activeFilters$: Observable<IActiveFilter[]> = this._customRoute.fqMap$.pipe(
    filter(() => !!this._customRoute.collection()),
    map((fqsMap) => {
      const collection = this._customRoute.collection();
      const filtersConfigs =
        this._filtersConfigsRepository.get(collection).filters;
      return toActiveFilters(fqsMap, filtersConfigs);
    })
  );

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  async removeFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: removeFilterValue(
          this._customRoute.fqMap(),
          filter,
          value,
          this._filtersConfigsRepository.get(this._customRoute.collection())
            .filters
        ),
      },
      queryParamsHandling: 'merge',
    });
  }
  async clearAll() {
    await this._router.navigate([], {
      queryParams: {
        fq: [],
      },
      queryParamsHandling: 'merge',
    });
  }
}
