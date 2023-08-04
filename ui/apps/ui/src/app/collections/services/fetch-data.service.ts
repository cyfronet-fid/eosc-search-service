import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IFacetBucket,
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
import {
  _EMPTY_FACETS_RESPONSE,
  _EMPTY_RESPONSE,
} from '../repositories/initial-states';
import { PaginationRepository } from '@components/results-with-pagination/pagination.repository';
import { FacetsResponse } from '@components/search-input/type';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  _urlResults = `/${environment.backendApiPath}/${environment.search.apiResultsPath}`;
  _urlFilters = `/${environment.backendApiPath}/${environment.search.apiFiltersPath}`;

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
        this._urlResults,
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
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }[]
  ): Observable<{
    [field: string]: ITermsFacetResponse | IStatFacetResponse;
  }> {
    if (facets.length > 1) {
      const mergedFacets = facets.reduce(
        (acc, facet) => ({ ...acc, ...facet }),
        {}
      );

      return this._http
        .post<FacetsResponse>(
          this._urlFilters,
          { facets: mergedFacets },
          { params: params as never }
        )
        .pipe(
          catchError(() => of(_EMPTY_FACETS_RESPONSE)),
          map((results: { [field: string]: IFacetBucket[] }) => {
            const convertedResponse: { [field: string]: ITermsFacetResponse } =
              {};

            for (const field of Object.keys(results)) {
              convertedResponse[field] = { buckets: results[field] };
            }
            return convertedResponse;
          })
        );
    } else {
      return this._http
        .post<ISearchResults<T>>(
          this._urlResults,
          { facets: facets[0] },
          { params: params as never }
        )
        .pipe(
          catchError(() => of(_EMPTY_RESPONSE)),
          map((results: ISearchResults<T>) => results.facets)
        );
    }
  }
}
