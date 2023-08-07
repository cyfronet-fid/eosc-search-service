import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IResult,
  ISearchResults,
  ISolrCollectionParams,
  ISolrQueryParams,
  IStatFacetParam,
  IStatFacetResponse,
  ITermsFacetParam,
  ITermsFacetResponse,
  adapterType,
} from '../repositories/types';
import { environment } from '@environment/environment';
import { _EMPTY_RESPONSE } from '../repositories/initial-states';
import { PaginationRepository } from '@components/results-with-pagination/pagination.repository';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  _url = `/${environment.backendApiPath}/${environment.search.apiPath}`;
  _urladv = `/${environment.backendApiPath}/${environment.search.apiPathAdv}`;

  constructor(
    private _http: HttpClient,
    private _paginationRepository: PaginationRepository
  ) {}

  fetchResults$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam },
    adapter: adapterType
  ): Observable<ISearchResults<IResult>> {
    this._paginationRepository.setLoading(true);
    return this._http
      .post<ISearchResults<T>>(
        this._url,
        { facets },
        { params: params as never }
      )
      .pipe(
        catchError(() => of(_EMPTY_RESPONSE)),
        tap(() => this._paginationRepository.setLoading(false)),
        map((response: ISearchResults<T>) => ({
          results: response.results.map((result) => adapter(result)),
          numFound: response.numFound,
          nextCursorMark: response.nextCursorMark,
          facets: response.facets,
          highlighting: response.highlighting,
        }))
      );
  }

  fetchResultsAdv$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: IFacetParam },
    adapter: adapterType
  ): Observable<ISearchResults<IResult>> {
    this._paginationRepository.setLoading(true);
    return this._http
      .post<ISearchResults<T>>(
        this._urladv,
        { facets },
        { params: params as never }
      )
      .pipe(
        catchError(() => of(_EMPTY_RESPONSE)),
        tap(() => this._paginationRepository.setLoading(false)),
        map((response: ISearchResults<T>) => ({
          results: response.results.map((result) => adapter(result)),
          numFound: response.numFound,
          nextCursorMark: response.nextCursorMark,
          facets: response.facets,
          highlighting: response.highlighting,
        }))
      );
  }

  fetchFacets$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }
  ): Observable<{ [field: string]: ITermsFacetResponse | IStatFacetResponse }> {
    return this._http
      .post<ISearchResults<T>>(
        this._url,
        { facets },
        { params: params as never }
      )
      .pipe(
        catchError(() => of(_EMPTY_RESPONSE)),
        map((results: ISearchResults<T>) => results.facets)
      );
  }
}
