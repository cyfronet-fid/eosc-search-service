import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { Observable, distinctUntilChanged, filter, map } from 'rxjs';
import { isEqual } from 'lodash-es';
import { ICustomRouteProps } from './custom-route.type';
import { queryParamsMapFrom } from '@collections/services/custom-route.utils';
import { toArray } from '@collections/filters-serializers/utils';
import { serializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { DEFAULT_SORT } from '@components/sort-by-functionality/sort-value.type';

const DEFAULT_PARAMS = {
  collection: null,
  q: '*',
  sortUI: DEFAULT_SORT,
  fq: [],
  cursor: '*',
  sort: [],
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
  readonly q$ = this._store$.pipe(select(({ q }) => q));
  readonly sortUI$ = this._store$.pipe(select(({ sortUI }) => sortUI));
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

  constructor(private _filtersConfigsRepository: FiltersConfigsRepository) {}

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
  _updateParamsBy(collection: string, currentUrl: string) {
    const parsedQueryParams = queryParamsMapFrom(currentUrl);
    this._store$.update(() => ({
      ...DEFAULT_PARAMS,
      ...parsedQueryParams,
      collection: collection,
      fq: toArray(parsedQueryParams['fq']),
      q: (parsedQueryParams['q'] as string | undefined) ?? '*',
    }));
  }
  setCollection(collection: string | null) {
    return this._store$.update((state) => ({
      ...state,
      collection,
    }));
  }
}
