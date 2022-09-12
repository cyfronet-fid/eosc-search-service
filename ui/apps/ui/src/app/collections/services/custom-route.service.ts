import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import {
  escapeQuery,
  fqsToMap,
  parseFqToArray,
  parseQueryParams,
} from './custom-route.utils';
import { Observable, distinctUntilChanged, filter, map } from 'rxjs';
import { isEqual } from 'lodash-es';
import { ICustomRouteProps } from './custom-route.type';

const DEFAULT_PARAMS = {
  collection: null,
  q: '*',
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
  readonly fqMap$ = this._store$.pipe(select(({ fq }) => fqsToMap(fq)));
  readonly params$: Observable<ICustomRouteProps> = this._store$.pipe(
    select((state) => state)
  );
  readonly fqWithExcludedFilter$ = (filter: string) =>
    this._store$.pipe(
      map(({ fq: fqs }) => fqs.filter((fq) => !fq.startsWith(filter))),
      distinctUntilChanged(isEqual)
    );

  // SYNC
  fqMap() {
    return this._store$.query(({ fq }) => fqsToMap(fq));
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
    const parsedQueryParams = parseQueryParams(currentUrl);
    this._store$.update(() => ({
      ...DEFAULT_PARAMS,
      ...parsedQueryParams,
      collection: collection,
      fq: parseFqToArray(parsedQueryParams['fq']),
      q: escapeQuery(
        (parsedQueryParams['q'] as string | undefined) ?? '*'
      ).trim(),
    }));
  }
  setCollection(collection: string | null) {
    return this._store$.update((state) => ({
      ...state,
      collection,
    }));
  }
}
