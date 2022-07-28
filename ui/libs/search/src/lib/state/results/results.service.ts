import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonSettings, ESS_SETTINGS, IFilterConfiguration} from '@eosc-search-service/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {PrimaryResultsRepository, RESULTS_ROWS, ResultsRepository, ROWS_PER_PAGE,} from './results.repository';
import {IFacetParam} from '../../services/search-service/facet-param.interface';
import {HashMap, IHasId} from '@eosc-search-service/types';
import {updateRequestStatus} from '@ngneat/elf-requests';
import {
  concatArrays,
  escapeQuery,
  FiltersRepository, INITIAL_FILTER_OPTION_COUNT, ISearchResults, ISet,
  ISolrCollectionParams,
  ISolrQueryParams,
  toSolrQueryParams,
} from '@eosc-search-service/search';
import {ActivatedRoute, Router} from '@angular/router';
import {IResult} from './results.model';
import {selectCurrentPageEntities, setCurrentPage, setPage, updatePaginationData,} from '@ngneat/elf-pagination';
import {addEntities} from "@ngneat/elf-entities";
import {Reducer} from "@ngneat/elf/lib/store";
import {StateOf} from "@ngneat/elf";
import {withPagination} from "@ngneat/elf-pagination/lib/pagination";

export interface ICollectionSearchMetadata<T = unknown> {
  _hash: string;
  facets: HashMap<IFacetParam>;
  inputAdapter: (item: Partial<T> & IHasId) => IResult;
  queryMutator: (q: string) => string;
  filtersConfigurations: IFilterConfiguration[];
  type: string;
  params: ISolrCollectionParams;
}

export class ResultsService {
  protected url: string;

  constructor(
    protected http: HttpClient,
    protected _router: Router,
    protected _repository: ResultsRepository,
    protected settings: CommonSettings,
    protected _filtersRepository: FiltersRepository | null = null
  ) {
    this.url = `/${this.settings.backendApiPath}/${this.settings.search.apiPath}`;
  }

  public search$<T extends IHasId>(
    metadata: ICollectionSearchMetadata<T> | null,
    params: ISolrQueryParams,
    rowsPerCollection: number = RESULTS_ROWS,
    page: number | null = null
  ): Observable<IResult[]> {
    let freshSearch = false;
    if (page === null || this._repository.resultsStore.getValue().lastQuery != params.q) {
      this._repository.clearResults();
      freshSearch = true;
    }
    const pageNumber = page || 0;
    if (metadata === null) {
      this._repository.setResults([]);
      this._repository.resultsStore.update(
        updateRequestStatus('results', 'success'),
        state => ({...state, lastQuery: params.q})
      );
      return of([]);
    }

    const isPageCached = this._repository.isPageCached(pageNumber);

    if (!isPageCached) {
      this._repository.clearActiveCollections();
    } else {
      this._repository.resultsStore.update(setCurrentPage(pageNumber));
    }

    const lastPage = this._repository.resultsStore.getValue().pagination.lastPage

    this._repository.resultsStore.update(updateRequestStatus('results', 'pending'));

    const loadPages$ = (preload: boolean) => this._getSingle$(metadata, params, rowsPerCollection, pageNumber).pipe(
      // return merged data
      map((response: ISearchResults<IResult>) => {
        const results = [...response.results];
        let page: number|string[] = [];
        const pagesOps: Reducer<any>[] = [];

        let startPageNumber = preload ? lastPage + 1 : pageNumber;

        do {
          page = results.splice(0, ROWS_PER_PAGE).map(r => r.id)
          if (page.length > 0) {
            pagesOps.push(setPage(startPageNumber + pagesOps.length, [...page]));
          }
        } while (results.length > 0)

        this._repository.resultsStore.update(
          addEntities(response.results),
          ...pagesOps,
          updatePaginationData({
            currentPage: pageNumber,
            perPage: ROWS_PER_PAGE,
            lastPage: lastPage + pagesOps.length - (preload ? 0 : 1),
            total: response.numFound
          }),
          state => ({...state, lastQuery: params.q})
        )
        return results;
      })
    )

    return (isPageCached
        ? this._repository.resultsStore.pipe(selectCurrentPageEntities(), take(1), switchMap(() => {
          if (lastPage <= pageNumber + 3) {
            return loadPages$(true);
          }
          return of([])
      }))
        : loadPages$(false)).pipe(
      tap((results) => {
        this._repository.resultsStore.update(updateRequestStatus('results', 'success'));
        if (this._filtersRepository === null || !freshSearch) {
          return;
        }
        this._filtersRepository.intialize(this._repository.collectionsMap, this._repository.collectionSearchStates, this._router.url);
      }),
      catchError((error) => {
        this._repository.resultsStore.update(updateRequestStatus('results', 'error', error));
        return of([]);
      })
    );
  }

  _getSingle$<T extends IHasId>(
    metadata: ICollectionSearchMetadata<T>,
    params: ISolrQueryParams,
    rows: number,
    pageNumber: number = 0
  ): Observable<ISearchResults<IResult>> {
    const _params = { ...params, ...metadata.params, rows: rows };

    if (_params.q !== '*') {
      _params.q = metadata.queryMutator(escapeQuery(_params.q));
    }
    if (pageNumber > 0) {
      _params.cursor =
        this._repository.resultsStore.getValue().collectionSearchStates[
          metadata.type
        ].cursor;
    }

    return  this.http.post<ISearchResults<T>>(
      this.url,
      { facets: Object.entries(metadata.facets).reduce((pv, [key, facet]) => {
        pv[key] = {...facet, offset: 0, limit: INITIAL_FILTER_OPTION_COUNT};
        return pv
        }, {} as HashMap<unknown>)},
      { params: _params }
    )
    .pipe(
      catchError(() =>
        of({
          results: [],
          numFound: 0,
          nextCursorMark: '',
          facets: {},
        })
      ),
      tap((data) => {
        this._repository.resultsStore.update((state) => {
          const maxPage = Math.ceil(data.numFound / ROWS_PER_PAGE)
          return {
            ...state,
            collectionSearchStates: {
              ...state.collectionSearchStates,
              [metadata.type]: {
                ...state.collectionSearchStates[metadata.type],
                maxResults: data.numFound,
                cursor: data.nextCursorMark,
                maxPage: maxPage,
                hasNext:
                  pageNumber <
                  maxPage,
                facets: data.facets,
                active: true,
              },
            },
          };
        });
      }),
      map((data) => ({
        ...data,
        results: data.results.map(metadata.inputAdapter),
      }))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _loadNextImpulse$ = new BehaviorSubject(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _loadNext = false;

  public loadNextPage(): void {
    if (this._repository.isLoading()) {
      return;
    }
    this._loadNext = true;
    this._loadNextImpulse$.next(null);
  }

  public connectToURLQuery$(route: ActivatedRoute): Observable<IResult[]> {
    return combineLatest({
      queryParams: route.queryParams.pipe(map(toSolrQueryParams)),
      activeSet: route.data.pipe(map((data) => data['activeSet'] as ISet)),
      page: route.queryParams.pipe(
        map((param) => param['page'] ? Number(param['page']) : null)
      ),
    }).pipe(
      switchMap((data) => {
        if (
          (data.page ?? 0) >
          Object.keys(this._repository.resultsStore.getValue().pagination.pages)
            .length
        ) {
          return from(
            this._router.navigate([], {
              queryParams: { page: undefined },
              replaceUrl: true,
              queryParamsHandling: 'merge',
            })
          ).pipe(map(() => data));
        }
        return of(data);
      }),
      switchMap(({ activeSet, queryParams, page }) =>
        this.search$(activeSet.collection, queryParams, RESULTS_ROWS, page)
      )
    );
  }

  public loadPage$(page: number): Observable<unknown> {
    return from(
      this._router.navigate([], {
        queryParams: {
          page: page,
        },
        queryParamsHandling: 'merge',
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PrimaryResultsService extends ResultsService {
  constructor(
    http: HttpClient,
    _router: Router,
    _repository: PrimaryResultsRepository,
    @Inject(ESS_SETTINGS) settings: CommonSettings,
    _filtersRepository: FiltersRepository
  ) {
    super(http, _router, _repository, settings, _filtersRepository);
  }
}
