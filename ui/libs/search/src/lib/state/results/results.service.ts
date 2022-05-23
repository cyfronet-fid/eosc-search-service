import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonSettings, ESS_SETTINGS} from '@eosc-search-service/common';
import {BehaviorSubject, catchError, combineLatest, forkJoin, map, Observable, of, switchMap, tap,} from 'rxjs';
import {
  ISearchResults,
  ISolrCollectionParams,
  ISolrQueryParams,
  PrimaryResultsRepository,
  RESULTS_ROWS,
  ResultsRepository,
  toSolrQueryParams,
} from './results.repository';
import {IFacetParam} from '../../services/search-service/facet-param.interface';
import {HashMap, IHasId} from '@eosc-search-service/types';
import {updateRequestStatus} from '@ngneat/elf-requests';
import {ISet, shuffleArray, TrainingService,} from '@eosc-search-service/search';
import {ActivatedRoute} from '@angular/router';
import {IResult} from "../../result.model";

export interface ICollectionSearchMetadata<T = unknown> {
  _hash: string;
  facets: HashMap<IFacetParam>;
  inputAdapter: (item: Partial<T> & IHasId) => IResult;
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

  public search$<T extends IHasId>(
    metadataList: ICollectionSearchMetadata<T>[],
    params: ISolrQueryParams,
    loadNext: boolean = true
  ): Observable<IResult[]> {
    if (!loadNext) {
      this._repository.clearResults();
    }
    if (metadataList.length === 0) {
      this._repository.setResults([]);
      this._repository.resultsStore.update(updateRequestStatus('results', 'success'));
      return of([]);
    }

    return forkJoin<ISearchResults<IResult>[]>(
      metadataList.map((metadata) => this._getSingle$(metadata, params, loadNext))
    ).pipe(
      // return merged data
      map((allResponses) =>
        allResponses.reduce(
          (acc, response) => [...acc, ...response.results],
          [] as IResult[]
        )
      ),
      map((results) => shuffleArray(results)),
      tap((results) => this._repository.addResults(results)),
      tap(() => updateRequestStatus('results', 'success')),
      catchError(error => {
        updateRequestStatus('results', 'error', error);
        return of([])
      }),
      tap(() => this._loadNext = false)
      // this._repository.trackResultsRequestsStatus('results')
    );
  }

  _getSingle$<T extends IHasId>(
    metadata: ICollectionSearchMetadata<T>,
    params: ISolrQueryParams,
    loadNext: boolean = false
  ): Observable<ISearchResults<IResult>> {
    const _params = { ...params, ...metadata.params };

    if (_params.q !== '*') {
      _params.q = _params.q + '*'
    }
    if (loadNext) {
      _params.cursor = this._repository.resultsStore.getValue().collectionSearchStates[metadata.type].cursor
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
                maxPage: Math.ceil(data.numFound / RESULTS_ROWS),
                hasNext:
                  state.collectionSearchStates[metadata.type].currentPage <
                  state.collectionSearchStates[metadata.type].maxPage,
                facets: data.facets,
                active: true
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

  private _loadNextImpulse$ = new BehaviorSubject(null)
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
          return this.search$(activeSet.collections, queryParams, this._loadNext)
        }
      )
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
