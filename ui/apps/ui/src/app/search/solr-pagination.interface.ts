import { SolrQueryParams } from './solr-query-params.interface';
import { FACETS, IFacetParam } from './facet-param.interface';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { environment } from '../../environments/environment';
import * as hash from 'object-hash';
import { ISearchResults } from './search-results.interface';

export abstract class ISolrPagination {
  protected static _URL = `${environment.backend.url}/${environment.backend.apiPath}/${environment.search.apiPath}`;

  protected _latestHash$ = new BehaviorSubject<string | null>(null);
  protected _latestParams$ = new BehaviorSubject<SolrQueryParams>(
    new SolrQueryParams()
  );
  protected _latestFacets$ = new BehaviorSubject<{
    [facet: string]: IFacetParam;
  }>(FACETS);

  protected _cursors$ = new BehaviorSubject(['*']);
  protected _currentPage$ = new BehaviorSubject(0);
  protected _maxPage$ = new BehaviorSubject(0);
  protected _maxResults$ = new BehaviorSubject(0);

  public hasNextPage$ = combineLatest([
    this._currentPage$,
    this._maxPage$,
  ]).pipe(map(([currentPage, maxPage]) => currentPage + 1 < maxPage));
  public hasPrevPage$ = this._currentPage$.pipe(
    map((currentPage) => currentPage > 0)
  );
  public currentResultsNumber$ = combineLatest([
    this._currentPage$,
    this._maxPage$,
    this._maxResults$,
    this._latestParams$,
  ]).pipe(
    map(([currentPage, maxPage, maxResults, latestParams]) => {
      if (currentPage + 1 === maxPage || maxResults === 0) {
        return maxResults;
      }

      return (currentPage + 1) * latestParams.rows;
    })
  );

  protected _updateSearchParams$(
    params: SolrQueryParams,
    facets: { [facet: string]: IFacetParam }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cursor, ...rest } = params.toJson();
    const newHash = hash({ ...rest, ...facets });
    if (this._latestHash$.value === newHash) {
      return;
    }

    this._latestHash$.next(newHash);
    this._currentPage$.next(0);
    this._cursors$.next(['*']);
    this._maxPage$.next(0);
    this._latestParams$.next(params);
    this._latestFacets$.next(facets);
  }

  protected _updatePaginationParams$<T>(response: ISearchResults<T>) {
    this._maxResults$.next(response.numFound);
    this._maxPage$.next(
      Math.ceil(response.numFound / this._latestParams$.value?.rows)
    );
    if (this._cursors$.value?.includes(response.nextCursorMark)) {
      return;
    }

    this._cursors$.next([...this._cursors$.value, response.nextCursorMark]);
  }

  protected _getNthPageParams$(nthPage: number = 0) {
    if (nthPage < 0) {
      throw new ISolrPaginationError(
        "Page can't be smaller than results available"
      );
    }

    if (nthPage > this._maxPage$.value) {
      throw new ISolrPaginationError(
        "Page can't be larger than results available"
      );
    }

    if (nthPage > this._cursors$.value.length) {
      throw new ISolrPaginationError("Cursor for nth page haven't been stored");
    }

    this._currentPage$.next(nthPage);
    const latestParams = new SolrQueryParams({
      ...this._latestParams$.value.toJson(),
      cursor: this._cursors$.value[nthPage],
    });
    this._latestParams$.next(latestParams);

    return latestParams;
  }

  /**
   * Fetch the latest search results
   *
   * @param params
   * @param facets
   * @param nthPage
   */
  abstract get$<T>(
    params: SolrQueryParams,
    facets?: { [facet: string]: IFacetParam },
    nthPage?: number
  ): Observable<ISearchResults<T>>;

  /**
   * Go to a next page based on the latest search params/facets
   */
  abstract nextPage$<T>(): Observable<ISearchResults<T>>;

  /**
   * Go to a previous page based on the latest search params/facets
   */
  abstract prevPage$<T>(): Observable<ISearchResults<T>>;
}

export class ISolrPaginationError extends Error {
  constructor(msg: string) {
    super(`Solr Pagination Error: ${msg}`);
  }
}
