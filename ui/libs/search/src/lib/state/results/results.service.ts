import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonSettings, ESS_SETTINGS } from '@eosc-search-service/common';
import {
  BehaviorSubject,
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
  concatArrays, escapeQuery,
  ISearchResults,
  ISet, ISolrCollectionParams, ISolrQueryParams,
  shuffleArray, toSolrQueryParams,
  TrainingService,
} from '@eosc-search-service/search';
import { ActivatedRoute } from '@angular/router';
import { IResult } from './results.model';

export interface ICollectionSearchMetadata<T = unknown> {
  _hash: string;
  facets: HashMap<IFacetParam>;
  inputAdapter: (item: Partial<T> & IHasId) => IResult;
  queryMutator: (q: string) => string;
  fieldToFilter: HashMap<string>;
  filterToField: HashMap<string>;
  type: string;
  params: ISolrCollectionParams;
}

export class ResultsService {
  protected url: string;

  constructor(
    protected http: HttpClient,
    protected _trainingService: TrainingService,
    protected _repository: ResultsRepository,
    protected settings: CommonSettings
  ) {
    this.url = `/${this.settings.backendApiPath}/${this.settings.search.apiPath}`;
  }

  protected reduceResults = (
    results: ISearchResults<IResult>[],
    metadataList: ICollectionSearchMetadata[]
  ): IResult[] => concatArrays(results.map(result => result.results));

  public search$<T extends IHasId>(
    metadataList: ICollectionSearchMetadata<T>[],
    params: ISolrQueryParams,
    rowsPerCollection: number = RESULTS_ROWS,
    loadNext: boolean = false
  ): Observable<IResult[]> {
    if (!loadNext) {
      this._repository.clearResults();
    }
    if (metadataList.length === 0) {
      this._repository.setResults([]);
      this._repository.resultsStore.update(
        updateRequestStatus('results', 'success')
      );
      return of([]);
    }

    return forkJoin<ISearchResults<IResult>[]>(
      metadataList.map((metadata) =>
        this._getSingle$(metadata, params, rowsPerCollection, loadNext)
      )
    ).pipe(
      // return merged data
      map((allResults) => this.reduceResults(allResults, metadataList)),
      tap((results) => this._repository.addResults(results)),
      tap(() => updateRequestStatus('results', 'success')),
      catchError((error) => {
        updateRequestStatus('results', 'error', error);
        return of([]);
      }),
      tap(() => (this._loadNext = false))
      // this._repository.trackResultsRequestsStatus('results')
    );
  }

  _getSingle$<T extends IHasId>(
    metadata: ICollectionSearchMetadata<T>,
    params: ISolrQueryParams,
    rows: number,
    loadNext: boolean = false
  ): Observable<ISearchResults<IResult>> {
    const _params = { ...params, ...metadata.params, rows: rows };

    if (_params.q !== '*') {
      _params.q = metadata.queryMutator(escapeQuery(_params.q));
    }
    if (loadNext) {
      _params.cursor =
        this._repository.resultsStore.getValue().collectionSearchStates[
          metadata.type
        ].cursor;
    }

    return (
      metadata.type === 'Training'
        ? this._trainingService.getByQuery$(_params.q).pipe(
            map(
              (trainings) =>
                ({
                  results: trainings as any[],
                  facets: {},
                  numFound: trainings.length,
                  nextCursorMark: '',
                } as ISearchResults<T>)
            )
          )
        : this.http.post<ISearchResults<T>>(
            this.url,
            { facets: metadata.facets },
            { params: _params }
          )
    ).pipe(
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
          return {
            ...state,
            collectionSearchStates: {
              ...state.collectionSearchStates,
              [metadata.type]: {
                ...state.collectionSearchStates[metadata.type],
                maxResults: data.numFound,
                cursor: data.nextCursorMark,
                maxPage: Math.ceil(data.numFound / rows),
                hasNext:
                  state.collectionSearchStates[metadata.type].currentPage <
                  state.collectionSearchStates[metadata.type].maxPage,
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

  private _loadNextImpulse$ = new BehaviorSubject(null);
  private _loadNext: boolean = false;

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
      loadNextImpulse: this._loadNextImpulse$,
    }).pipe(
      switchMap(({ activeSet, queryParams }) => {
        return this.search$(activeSet.collections, queryParams, RESULTS_ROWS, this._loadNext);
      })
    );
  }
}

@Injectable({ providedIn: 'root' })
export class PrimaryResultsService extends ResultsService {
  constructor(
    http: HttpClient,
    _repository: PrimaryResultsRepository,
    _trainingService: TrainingService,
    @Inject(ESS_SETTINGS) settings: CommonSettings
  ) {
    super(http, _trainingService, _repository, settings);
  }
}
