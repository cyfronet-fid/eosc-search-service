import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IFacetBucket,
  IResult,
  ISearchResults,
  ISolrCollectionParams,
  // ISolrFilterParams,
  ISolrQueryParams,
  ISolrSuggestionQueryParams,
  IStatFacetParam,
  IStatFacetResponse,
  ITermsFacetParam,
  ITermsFacetResponse,
  adapterType,
} from '../repositories/types';
import { environment } from '@environment/environment';
import {
  _EMPTY_CITATION_RESPONSE,
  _EMPTY_EXPORT_RESPONSE,
  _EMPTY_FACETS_RESPONSE,
  _EMPTY_RESPONSE,
  _EMPTY_SUGGESTIONS_RESPONSE,
} from '../repositories/initial-states';
import { PaginationRepository } from '@components/results-with-pagination/pagination.repository';
import { BibliographyRecord, Citation } from '@components/bibliography/types';
import {
  FacetsResponse,
  SuggestionResponse,
} from '@components/search-input/types';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  _urlResults = `/${environment.backendApiPath}/${environment.search.apiResultsPath}`;
  _urlFilters = `/${environment.backendApiPath}/${environment.search.apiFiltersPath}`;
  _download_url = `/${environment.backendApiPath}/${environment.search.downloadPath}`;
  _suggestions_url = `/${environment.backendApiPath}/${environment.search.suggestionsPath}`;
  _export_url = `/${environment.backendApiPath}/${environment.search.bibExportPath}`;
  _cite_url = `/${environment.backendApiPath}/${environment.search.bibCitationPath}`;
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
        this._urlResults,
        { facets },
        { params: params as never }
      )
      .pipe(
        catchError(() => of(_EMPTY_RESPONSE)),
        tap(() => {
          // this._paginationRepository.setLoading(false);
        }),
        map((response: ISearchResults<T>) => ({
          results: response.results.map((result) => adapter(result)),
          numFound: response.numFound,
          nextCursorMark: response.nextCursorMark,
          facets: response.facets,
          highlighting: response.highlighting,
          isError: response.isError,
        }))
      );
  }

  downloadResults$(
    params: ISolrCollectionParams & ISolrQueryParams,
    advanced: boolean,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }
  ): Observable<ArrayBuffer> {
    return this._http.post<ArrayBuffer>(
      advanced ? this._urladv : this._urlResults,
      { facets },
      {
        responseType: 'text' as 'json',
        params: { ...params, return_csv: true },
      }
    );
  }

  fetchResultsAdv$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam },
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
        tap(() => {
          // this._paginationRepository.setLoading(false);
        }),
        map((response: ISearchResults<T>) => ({
          results: response.results.map((result) => adapter(result)),
          numFound: response.numFound,
          nextCursorMark: response.nextCursorMark,
          facets: response.facets,
          highlighting: response.highlighting,
          isError: response.isError,
        }))
      );
  }

  fetchSuggestions$(
    params: ISolrCollectionParams & ISolrSuggestionQueryParams
  ): Observable<SuggestionResponse> {
    this._paginationRepository.setLoading(true);
    return this._http
      .post<SuggestionResponse>(
        this._suggestions_url,
        {},
        { params: params as never }
      )
      .pipe(
        catchError(() => of(_EMPTY_SUGGESTIONS_RESPONSE)),

        tap(() => {
          this._paginationRepository.setLoading(false);
        })
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchFilters$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }[]
  ): Observable<{
    [field: string]: ITermsFacetResponse | IStatFacetResponse;
  }> {
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
  }

  fetchFacets$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }[]
  ): Observable<{
    [field: string]: ITermsFacetResponse | IStatFacetResponse;
  }> {
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

  fetchExport$(pid: string): Observable<BibliographyRecord[]> {
    const params = { pid: pid };
    return this._http
      .get<BibliographyRecord[]>(this._export_url, { params })
      .pipe(
        catchError(() => of([_EMPTY_EXPORT_RESPONSE])),
        map((responses: BibliographyRecord[]) => {
          return responses.map((response: BibliographyRecord) => ({
            type: response.type,
            record: response.record,
          }));
        })
      );
  }

  fetchCitation$(pid: string, style: string): Observable<Citation> {
    const params = { pid: pid, style: style };
    return this._http.get<Citation>(this._cite_url, { params }).pipe(
      catchError(() => of(_EMPTY_CITATION_RESPONSE)),
      map((response: Citation) => ({
        style: response.style,
        citation: response.citation,
      }))
    );
  }
}
