import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import {
  addFq,
  escapeQuery,
  fqsToMap,
  parseFqToArray,
  parseQueryParams,
  removeFq,
} from './query-params.utils';
import { Observable, distinctUntilChanged, filter, map } from 'rxjs';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { ICustomRouterProps, paramType } from './custom-router.type';

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
export class CustomRouter {
  _router: Router | undefined;

  readonly _store$ = createStore(
    {
      name: 'custom-router',
    },
    withProps<ICustomRouterProps>(DEFAULT_PARAMS)
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
  readonly params$: Observable<ICustomRouterProps> = this._store$.pipe(
    select((state) => state)
  );
  readonly fqWithExcludedFilter$ = (filter: string) =>
    this._store$.pipe(
      map(({ fq: fqs }) => fqs.filter((fq) => !fq.startsWith(filter))),
      distinctUntilChanged(isEqual)
    );

  // SYNC
  readonly fqMap = () => this._store$.query(({ fq }) => fqsToMap(fq));
  readonly collection = () =>
    this._store$.query(({ collection }) => collection);
  readonly cursor = () => this._store$.query(({ cursor }) => cursor);
  readonly params = () => this._store$.query((state) => state);
  readonly fq = () => this._store$.query(({ fq }) => fq);
  readonly fqWithExcludedFilter = (filter: string) =>
    this._store$.query(({ fq: fqs }) =>
      fqs.filter((fq) => !fq.startsWith(filter))
    );

  // Internal state updates
  _updateParamsBy = (collection: string, currentUrl: string) => {
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
  };
  setCollection = (collection: string | null) =>
    this._store$.update((state) => ({
      ...state,
      collection,
    }));

  // URL updates
  removeFilterFromUrl = async (filter: string) => {
    return this.updateQueryParamsInUrl({
      fq: this.fq().filter((fq) => !fq.startsWith(filter)),
    });
  };
  addFilterValueToUrl = (filter: string, value: string) =>
    this.updateQueryParamsInUrl({ fq: addFq(this.fqMap(), filter, value) });
  removeFilterValueFromUrl = (filter: string, value: string) =>
    this.updateQueryParamsInUrl({ fq: removeFq(this.fqMap(), filter, value) });
  setQueryInUrl = (q: string = '*', url: string[] = []) =>
    this.updateQueryParamsInUrl({ q: escapeQuery(q).trim() }, url);
  setCursorInUrl = (cursor: string = '*') =>
    this.updateQueryParamsInUrl({ cursor });
  updateQueryParamsInUrl = async (
    queryParams: {
      [field: string]: paramType;
    },
    url: string[] = []
  ) => {
    await this._router?.navigate(url, {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  };
  navigateByUrl = async (url: string | undefined) => {
    await this._router?.navigate([url as string], {
      queryParams: {
        fq: [],
        cursor: '*',
      },
      queryParamsHandling: 'merge',
    });
  };
}
