import { Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';

import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IActiveFilter } from './type';
import { CustomRoute } from '@collections/services/custom-route.service';
import { toActiveFilters } from './utils';
import { Router } from '@angular/router';
import { removeFq } from '@collections/services/custom-route.utils';

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
  activeFilters$: Observable<IActiveFilter[]> = this._customRoute.fqMap$.pipe(
    filter(() => !!this._customRoute.collection()),
    map((fqsMap) => {
      const collection = this._customRoute.collection();
      const filtersConfigs =
        this._filtersConfigsRepository.get(collection).filters;
      return toActiveFilters(fqsMap, filtersConfigs);
    })
  );
  q$ = this._customRoute.q$;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  async removeFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: removeFq(this._customRoute.fqMap(), filter, value),
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
  async clearQuery() {
    await this._router.navigate([], {
      queryParams: {
        q: '*',
      },
      queryParamsHandling: 'merge',
    });
  }
}
