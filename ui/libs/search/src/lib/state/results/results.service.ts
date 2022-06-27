import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonSettings, ESS_SETTINGS } from '@eosc-search-service/common';
import {
  catchError,
  combineLatest,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  PrimaryResultsRepository,
  RESULTS_ROWS,
  ResultsRepository,
} from './results.repository';
import { IFacetParam } from '../../services/search-service/facet-param.interface';
import { HashMap, IHasId } from '@eosc-search-service/types';
import { updateRequestStatus } from '@ngneat/elf-requests';
import {
  concatArrays,
  escapeQuery, FiltersRepository,
  ISearchResults,
  ISet,
  ISolrCollectionParams,
  ISolrQueryParams,
  toSolrQueryParams,
  TrainingService,
  ISet, ISolrCollectionParams, ISolrQueryParams,
  toSolrQueryParams,
} from '@eosc-search-service/search';
import { ActivatedRoute, Router } from '@angular/router';
import { IResult } from './results.model';
import {
  setPage,
  skipWhilePageExists,
  updatePaginationData,
} from '@ngneat/elf-pagination';
import { from } from 'rxjs';

export interface ICollectionSearchMetadata<T = unknown> {
  _hash: string;
  facets: HashMap<IFacetParam>;
  inputAdapter: (item: Partial<T> & IHasId) => IResult;
  queryMutator: (q: string) => string;
  filterToField: HashMap<string>;
  type: string;
  params: ISolrCollectionParams;
}

export class ResultsService {
  protected url: string;

  constructor(
    protected http: HttpClient,
    protected _router: Router,
    protected _trainingService: TrainingService,
    protected _repository: ResultsRepository,
    protected settings: CommonSettings,
    protected _filtersRepository: FiltersRepository | null = null
  ) {
    this.url = `/${this.settings.backendApiPath}/${this.settings.search.apiPath}`;
  }

  protected reduceResults = (
    results: ISearchResults<IResult>[],
    metadataList: ICollectionSearchMetadata[]
  ): IResult[] => concatArrays(results.map((result) => result.results));

  public search$<T extends IHasId>(
    metadataList: ICollectionSearchMetadata<T>[],
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
    if (metadataList.length === 0) {
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
    }

    const lastPage = isPageCached
      ? this._repository.resultsStore.getValue().pagination.lastPage
      : pageNumber;

    return (
      isPageCached
        ? of([])
        : forkJoin<ISearchResults<IResult>[]>(
            metadataList.map((metadata) =>
              this._getSingle$(metadata, params, rowsPerCollection, pageNumber)
            )
          ).pipe(
            // return merged data
            map((allResults) => this.reduceResults(allResults, metadataList)),
            tap((results) => this._repository.addResults(results)),
            tap((results) =>
              this._repository.resultsStore.update(
                setPage(
                  pageNumber,
                  results.map((r) => r.id)
                )
              )
            )
          )
    ).pipe(
      tap((results) =>
        this._repository.resultsStore.update(
          updatePaginationData({
            currentPage: pageNumber,
            perPage: metadataList.length * RESULTS_ROWS,
            total: results.length,
            lastPage: lastPage,
          }),
          state => ({...state, lastQuery: params.q})
        )
      ),
      tap((results) => {
        if (this._filtersRepository === null || !freshSearch) {
          return;
        }
        this._filtersRepository.intialize(this._repository.collectionsMap, this._repository.collectionSearchStates, this._router.url);
      }),
      tap(() => updateRequestStatus('results', 'success')),
      catchError((error) => {
        updateRequestStatus('results', 'error', error);
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
      { facets: metadata.facets },
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
          const maxPage = Math.ceil(data.numFound / rows)
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
        this.search$(activeSet.collections, queryParams, RESULTS_ROWS, page)
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
    _trainingService: TrainingService,
    @Inject(ESS_SETTINGS) settings: CommonSettings,
    _filtersRepository: FiltersRepository
  ) {
    super(http, _router, _trainingService, _repository, settings, _filtersRepository);
  }
}
