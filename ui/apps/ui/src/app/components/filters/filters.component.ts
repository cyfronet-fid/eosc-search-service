import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import {
  ICollectionSearchMetadata,
  IFiltersConfig,
  ITermsFacetParam,
} from '@collections/repositories/types';
import { FilterService } from '@components/filters/filters.service';
import { toSearchMetadata } from '@components/filters/utils';
import { toFilterFacet } from '@components/filters/filter-multiselect/utils';

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
    private _filtersConfigsRepository: FiltersConfigsRepository, // If needed
    private _route: ActivatedRoute,
    private _filterService: FilterService
  ) {
    this._filterService.clearCache();
    const metadata = this._filterService.searchMetadataRepository.get(
      this._filterService.customRoute.params()['collection'] as string
    ) as ICollectionSearchMetadata;

    this.filtersConfigs$.subscribe((filtersConfig) => {
      const filtersBatch: string[] = [];
      const facetsBatch: { [facet: string]: ITermsFacetParam }[] = [];

      filtersConfig.forEach((filterConfig) => {
        const filter = filterConfig.filter;
        const facetParams = toFilterFacet(filter);
        filtersBatch.push(filter);
        facetsBatch.push({ [filter]: facetParams[filter] });
      });

      this._filterService.fetchTreeNodes$(
        filtersBatch,
        toSearchMetadata('*', [], metadata),
        facetsBatch
      );
    });
  }
}
