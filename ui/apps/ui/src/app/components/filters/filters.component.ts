import { Component } from '@angular/core';
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

      <ng-container *ngFor="let filterConfig of filtersConfigs$ | async">
        <ng-container [ngSwitch]="filterConfig.type">
          <ess-filter-multiselect
            *ngSwitchCase="'multiselect'"
            [label]="filterConfig.label"
            [filter]="filterConfig.filter"
          ></ess-filter-multiselect>
          <ess-filter-date
            *ngSwitchCase="'date'"
            [label]="filterConfig.label"
            [filter]="filterConfig.filter"
          >
          </ess-filter-date>
        </ng-container>
        <ng-container [ngSwitch]="filterConfig.type">
          <ess-filter-range
            *ngSwitchCase="'range'"
            [label]="filterConfig.label"
            [filter]="filterConfig.filter"
          ></ess-filter-range>
        </ng-container>
      </ng-container>
    </section>
  `,
  styles: [],
})
export class FiltersComponent {
  filtersConfigs$ = this._route.paramMap.pipe(
    filter((paramMap) => !!paramMap.get('collection')),
    map((paramMap) => {
      const filtersConfigs = this._filtersConfigsRepository.get(
        paramMap.get('collection')
      ) as IFiltersConfig;
      return filtersConfigs.filters;
    })
  );

  constructor(
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _route: ActivatedRoute
  ) {}
}
