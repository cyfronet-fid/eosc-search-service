/* eslint-disable @typescript-eslint/no-explicit-any  */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISearchResults } from './search-results.interface';
import { Observable, map, tap } from 'rxjs';
import { ISolrPagination } from './solr-pagination.interface';
import {
  filterContainingBuckets,
  toTreeParams,
} from '../marketplace-page/utils';
import { SolrQueryParams } from './solr-query-params.interface';
import { FACETS } from './facet-param.interface';

export class SearchServiceError extends Error {
  constructor(msg: string) {
    super(`Search service query error: ${msg}`);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SearchService extends ISolrPagination {
  constructor(private _http: HttpClient) {
    super();
  }

  getFilters$() {
    const params = new SolrQueryParams();
    return this._http
      .post<ISearchResults<any>>(
        SearchService._URL,
        { facets: FACETS },
        { params: params.toJson() as any }
      )
      .pipe(
        map((response) => response.facets),
        map(filterContainingBuckets),
        map(toTreeParams)
      );
  }
  get$<T>(
    params: SolrQueryParams,
    facets = FACETS
  ): Observable<ISearchResults<T>> {
    this._updateSearchParams$(params, facets);
    return this._http
      .post<ISearchResults<T>>(
        SearchService._URL,
        { facets },
        { params: params.toJson() }
      )
      .pipe(tap((response) => this._updatePaginationParams$<T>(response)));
  }
  nextPage$<T>(): Observable<ISearchResults<T>> {
    const params = this._getNthPageParams$(
      this._currentPage$.value + 1
    ).toJson();
    const facets = this._latestFacets$.value;
    return this._http
      .post<ISearchResults<T>>(SearchService._URL, { facets }, { params })
      .pipe(tap((response) => this._updatePaginationParams$<T>(response)));
  }
  prevPage$<T>(): Observable<ISearchResults<T>> {
    const params = this._getNthPageParams$(
      this._currentPage$.value - 1
    ).toJson();
    const facets = this._latestFacets$.value;
    return this._http
      .post<ISearchResults<T>>(SearchService._URL, { facets }, { params })
      .pipe(tap((response) => this._updatePaginationParams$<T>(response)));
  }
}
