import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { Observable, distinctUntilChanged, filter, map, tap } from 'rxjs';
import { isEqual } from 'lodash-es';
import { ICustomRouteProps, IFqMap } from './custom-route.type';
import {
  getFiltersFromTags,
  queryParamsMapFrom,
} from '@collections/services/custom-route.utils';
import { toArray } from '@collections/filters-serializers/utils';
import {
  deserializeAll,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { DEFAULT_SORT } from '@components/sort-by-functionality/sort-value.type';
import { toSearchMetadata } from '@components/filters/utils';
import { toFilterFacet } from '@components/filters/utils';
import {
  ICollectionSearchMetadata,
  IFilterConfig,
  ITermsFacetParam,
} from '@collections/repositories/types';
import { FilterService } from '@components/filters/filters.service';

export const DEFAULT_SCOPE = 'pl';

const DEFAULT_PARAMS = {
  collection: null,
  scope: DEFAULT_SCOPE,
  q: '*',
  sort_ui: DEFAULT_SORT,
  fq: [],
  cursor: '*',
  sort: [],
  standard: 'true',
  exact: 'false',
  tags: [],
  radioValueAuthor: 'A',
  radioValueExact: 'A',
  radioValueTitle: 'A',
  radioValueKeyword: 'A',
};

@Injectable({
  providedIn: 'root',
})
export class CustomRoute {
  readonly _store$ = createStore(
    {
      name: 'custom-router',
    },
    withProps<ICustomRouteProps>(DEFAULT_PARAMS)
  );

  // ASYNC
  readonly cursor$ = this._store$.pipe(select(({ cursor }) => cursor));
  readonly collection$ = this._store$.pipe(
    select(({ collection }) => collection),
    filter((collection) => !!collection),
    map((collection) => collection as string)
  );
  readonly scope$ = this._store$.pipe(select(({ scope }) => scope));
  readonly q$ = this._store$.pipe(select(({ q }) => q));
  readonly standard$ = this._store$.pipe(select(({ standard }) => standard));
  readonly sort_ui$ = this._store$.pipe(select(({ sort_ui }) => sort_ui));
  readonly tags$ = this._store$.pipe(select(({ tags }) => tags));
  readonly exact$ = this._store$.pipe(select(({ exact }) => exact));
  readonly radioValueAuthor$ = this._store$.pipe(
    select(({ radioValueAuthor }) => radioValueAuthor)
  );
  readonly radioValueExact$ = this._store$.pipe(
    select(({ radioValueExact }) => radioValueExact)
  );
  readonly radioValueTitle$ = this._store$.pipe(
    select(({ radioValueTitle }) => radioValueTitle)
  );
  readonly radioValueKeyword$ = this._store$.pipe(
    select(({ radioValueKeyword }) => radioValueKeyword)
  );

  readonly fqMap$ = this._store$.pipe(
    select(({ fq }) =>
      serializeAll(
        fq,
        this._filtersConfigsRepository.get(this.collection()).filters
      )
    )
  );

  readonly params$: Observable<ICustomRouteProps> = this._store$.pipe(
    select((state) => state)
  );

  readonly fqWithExcludedFilter$ = (filter: string) =>
    this._store$.pipe(
      map(({ fq: fqs }) => fqs.filter((fq) => !fq.startsWith(filter))),
      distinctUntilChanged(isEqual)
    );

  constructor(
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _filterService: FilterService
  ) {}

  // SYNC
  fqMap() {
    return this._store$.query(({ fq }) =>
      serializeAll(
        fq,
        this._filtersConfigsRepository.get(this.collection()).filters
      )
    );
  }
  collection() {
    return this._store$.query(({ collection }) => collection);
  }
  scope() {
    return this._store$.query(({ scope }) => scope);
  }
  cursor() {
    return this._store$.query(({ cursor }) => cursor);
  }
  params() {
    return this._store$.query((state) => state);
  }
  fq() {
    return this._store$.query(({ fq }) => fq);
  }
  fqWithExcludedFilter(filter: string) {
    return this._store$.query(({ fq: fqs }) =>
      fqs.filter((fq) => !fq.startsWith(filter))
    );
  }

  // Internal state updates
  _updateParamsBy(collection: string, currentUrl: string): ICustomRouteProps {
    const parsedQueryParams = queryParamsMapFrom(currentUrl);
    const q = (parsedQueryParams['q'] as string | undefined) ?? '*';
    const scope =
      (parsedQueryParams['scope'] as string | undefined) ?? DEFAULT_SCOPE;
    if (this._store$.getValue().collection !== collection) {
      this._filtersConfigsRepository.setScope();
    }

    const fq = toArray(parsedQueryParams['fq']);

    const routeProps = {
      ...DEFAULT_PARAMS,
      ...parsedQueryParams,
      collection: collection,
      scope: scope,
      fq: fq,
      q: q,
      exact: (parsedQueryParams['exact'] as string | undefined) ?? 'false',
      radioValueAuthor:
        (parsedQueryParams['radioValueAuthor'] as string | undefined) ?? 'A',
      radioValueExact:
        (parsedQueryParams['radioValueExact'] as string | undefined) ?? 'A',
      radioValueTitle:
        (parsedQueryParams['radioValueTitle'] as string | undefined) ?? 'A',
      radioValueKeyword:
        (parsedQueryParams['radioValueKeyword'] as string | undefined) ?? 'A',
    };

    this._store$.update(() => routeProps);
    return routeProps;
  }

  _getFqArray() {
    return getFiltersFromTags(
      this._store$.getValue().tags,
      this._store$.getValue().radioValueAuthor,
      this._store$.getValue().radioValueExact,
      this._store$.getValue().radioValueTitle,
      this._store$.getValue().radioValueKeyword
    );
  }

  fetchFilters$(q: string, fq: string[], collection: string, scope: string) {
    const fqArray = this._getFqArray();

    const metadata = this._filterService.searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;

    const filtersConfig = this._filtersConfigsRepository.get(
      this.collection()
    ).filters;

    const filtersBatch: IFilterConfig[] = [];
    const facetsBatch: { [facet: string]: ITermsFacetParam }[] = [];

    const AVAILABLE_FILTERS_TYPES: string[] = [
      'multiselect',
      'date-year',
      'date-start-end',
      'date-range',
      'date-calendar',
      'range',
      'dropdown',
      'checkbox-resource-type',
      'checkbox-status',
    ];

    filtersConfig
      .filter((filterConfig) =>
        AVAILABLE_FILTERS_TYPES.includes(filterConfig.type)
      )
      .forEach((filterConfig) => {
        const filter = filterConfig.filter;
        const facetParams = toFilterFacet(filter);
        filtersBatch.push(filterConfig);
        facetsBatch.push({ [filter]: facetParams[filter] });
      });

    this._filtersConfigsRepository.setLoading(true);
    return this._filterService
      .fetchTreeNodes$(
        filtersBatch,
        toSearchMetadata(
          q,
          scope,
          this._store$.getValue().exact,
          [...fqArray, ...fq],
          metadata
        ),
        facetsBatch
      )
      .pipe(
        tap((nodes) => {
          this._filtersConfigsRepository.setFilterNodes(
            collection,
            nodes,
            this.fqMap()
          );
          this._filtersConfigsRepository.setLoading(false);
        })
      );
  }

  getGlobalFq$(collection: string): Observable<string> {
    return this.fqMap$.pipe(
      map((fqMap) => {
        const globalFilterConfigs = this._filtersConfigsRepository
          .get(collection)
          .filters.filter((x) => x.global);

        const globalFilterIds = globalFilterConfigs.map(({ id }) => id);

        const globalFqMap = Object.fromEntries(
          Object.entries(fqMap).filter(([id]) => globalFilterIds.includes(id))
        ) as IFqMap;

        return deserializeAll(globalFqMap, globalFilterConfigs).join('&');
      })
    );
  }

  setCollection(collection: string | null) {
    return this._store$.update((state) => ({
      ...state,
      collection,
    }));
  }
}
