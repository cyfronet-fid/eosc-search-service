/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IFilterConfig,
  IFilterConfigUI,
  IFiltersConfig,
  filterUIEntitiesRef,
} from '@collections/repositories/types';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { Observable, combineLatest, debounceTime, filter, map } from 'rxjs';
import { selectEntities } from '@ngneat/elf-entities';

@UntilDestroy()
@Component({
  selector: 'ess-page-header',
  template: ` <div id="container-upper" class="page-heading"></div> `,
  styles: [
    `
      #container-upper {
        display: flex;
        flex-direction: row;
        justify-content: left;
        margin-bottom: 0;
        align-items: flex-start;
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
