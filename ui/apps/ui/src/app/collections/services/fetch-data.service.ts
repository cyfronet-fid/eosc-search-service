import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  IResult,
  ISearchResults,
  ISolrCollectionParams,
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
  _EMPTY_RESPONSE,
  _EMPTY_SUGGESTIONS_RESPONSE,
} from '../repositories/initial-states';
import { PaginationRepository } from '@components/results-with-pagination/pagination.repository';
import { SuggestionResponse } from '@components/search-input/types';
import { BibliographyRecord, Citation } from '@components/bibliography/types';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  _search_url = `/${environment.backendApiPath}/${environment.search.apiPath}`;
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
        this._search_url,
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

        tap(() => this._paginationRepository.setLoading(false))
      );
  }

  fetchFacets$<T extends { id: string }>(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [field: string]: ITermsFacetParam | IStatFacetParam }
  ): Observable<{ [field: string]: ITermsFacetResponse | IStatFacetResponse }> {
    return this._http
      .post<ISearchResults<T>>(
        this._search_url,
        { facets },
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
