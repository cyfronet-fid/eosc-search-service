import { Component } from '@angular/core';
import { Observable, filter, map } from 'rxjs';

import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IActiveFilter } from './type';
import { CustomRoute } from '@collections/services/custom-route.service';
import { toActiveFilters } from './utils';
import { Router } from '@angular/router';
import { removeFilterValue } from '@collections/filters-serializers/filters-serializers.utils';

const GUIDELINE_CONTEXT_FILTER = 'guideline-context';

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
        <span class="{{ getLabel(activeFilter.label) }}"
          >{{ getLabel(activeFilter.label) }}:
        </span>
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
  activeFilters$: Observable<IActiveFilter[]> = this._customRoute.params$.pipe(
    filter(({ collection }) => !!collection),
    map(({ collection, fq, guideline }) => {
      const filtersConfigs =
        this._filtersConfigsRepository.get(collection).filters;
      const activeFilters = toActiveFilters(
        this._customRoute.fqMap(),
        filtersConfigs
      );
      const guidelineTitle =
        typeof guideline === 'string' ? guideline.trim() : '';

      if (
        collection === 'service' &&
        guidelineTitle &&
        fq.some((value) => value.startsWith('pid:'))
      ) {
        activeFilters.push({
          filter: GUIDELINE_CONTEXT_FILTER,
          label: 'Guideline',
          uiValue: guidelineTitle,
          value: guidelineTitle,
        });
      }

      return activeFilters;
    })
  );

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  async removeFilter(filter: string, value: string) {
    if (filter === GUIDELINE_CONTEXT_FILTER) {
      await this._router.navigate([], {
        queryParams: {
          fq: this._customRoute.fqWithExcludedFilter('pid:'),
          guideline: null,
        },
        queryParamsHandling: 'merge',
      });
      return;
    }

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
        guideline: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  getLabel(label: string): string {
    return label === 'Provider' ? 'Organisation' : label;
  }
}
