import {HashMap} from '@eosc-search-service/types';
import {createStore, select, setProp, withProps} from '@ngneat/elf';
import {addEntities, setEntities, withEntities,} from '@ngneat/elf-entities';
import {
  createRequestsStatusOperator,
  selectRequestStatus,
  updateRequestStatus,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import {map, Observable, shareReplay} from 'rxjs';
import {ISet} from '../../sets';
import {Inject, Injectable} from '@angular/core';
import {SEARCH_SET_LIST} from '../../search.providers';
import {ICollectionSearchMetadata} from './results.service';
import {clearSearchState, CollectionsSearchState, IPage, IResult, makeSearchState, SearchState} from './results.model';
import {deleteAllPages, selectCurrentPageEntities, selectPaginationData, withPagination} from "@ngneat/elf-pagination";
import {Router} from "@angular/router";

export const RESULTS_ROWS = 20;

export class ResultsRepository {
  readonly collectionsMap: HashMap<ICollectionSearchMetadata>;
  // noinspection TypeScriptExplicitMemberType
  readonly resultsStore = createStore(
    {
      name: `results-${this._storeName}`,
    },
    withProps<CollectionsSearchState>({ collectionSearchStates: {} }),
    withProps<{lastQuery: string | null}>({lastQuery: null}),
    withEntities<IResult>(),
    withPagination(),
    withRequestsStatus<'results'>()
  );

  readonly maxResults$: Observable<number> = this.resultsStore.pipe(
    select((state) =>
      Object.values(state.collectionSearchStates)
        .map(({ maxResults }) => maxResults)
        .reduce((acc, size) => acc + size, 0)
    )
  );

  readonly hasNextPage$: Observable<boolean> = this.resultsStore.pipe(
    select((state) =>
      Object.values(state.collectionSearchStates).filter(collection => collection.active).some(
        (searchState) => searchState.hasNext
      )
    ),
    shareReplay({refCount: true})
  );

  readonly maxPage$: Observable<number> = this.resultsStore.pipe(
    select((state) =>
      Object.values(state.collectionSearchStates).filter(collection => collection.active).reduce((pv, cv) => Math.max(pv, cv.maxPage), 0)
    ),
    shareReplay({refCount: true})
  );

  readonly resultsStatus$ = this.resultsStore.pipe(
    selectRequestStatus('results'),
    shareReplay({ refCount: true })
  );

  readonly loading$ = this.resultsStatus$.pipe(
    map((status) => status.value === 'pending')
  );

  readonly results$ = this.resultsStore.pipe(
    selectCurrentPageEntities(),
    shareReplay({ refCount: true })
  );

  readonly pages$: Observable<IPage[]> = this.resultsStore.pipe(
    selectPaginationData(),
    map(data => Object.keys(data.pages).map(p => ({index: Number(p)}))),
  );

  readonly activeCollectionMetadata$ = this.resultsStore.pipe(
    select((state) => state.collectionSearchStates),
    map((collections) =>
      Object.values(collections).filter((collection) => collection.active)
    )
  );

  readonly trackResultsRequestsStatus = createRequestsStatusOperator(
    this.resultsStore
  );

  get collectionSearchStates(): HashMap<SearchState> {
    return this.resultsStore.getValue().collectionSearchStates;
  }

  constructor(private _storeName = 'base', private sets: ISet[], private _router: Router) {
    this._initializeStoreCollection(this.sets);
    this.collectionsMap = {};
    this.sets.forEach((set) => {
      set.collections.forEach(
        (collection) => (this.collectionsMap[collection.type] = collection)
      );
    });
  }

  isLoading(): boolean {
    return (
      this.resultsStore.getValue().requestsStatus.results.value === 'pending'
    );
  }

  setResults(results: IResult[]) {
    this.resultsStore.update(
      setEntities(results),
      updateRequestStatus('results', 'success')
    );
  }

  addResults(results: IResult[]) {
    this.resultsStore.update(
      addEntities(results),
      updateRequestStatus('results', 'success')
    );
  }

  clearResults() {
    this.resultsStore.update(
      setEntities([]),
      setProp('collectionSearchStates', (state) => clearSearchState(state)),
      deleteAllPages(),
      updateRequestStatus('results', 'pending')
    );
  }

  private _initializeStoreCollection(sets: ISet[]) {
    this.resultsStore.update((state) => ({
      ...state,
      collectionSearchStates: sets.reduce((acc, set) => {
        set.collections.forEach((col) => {
          if (acc[col.type] !== undefined) {
            return;
          }
          acc[col.type] = makeSearchState();
        });
        return acc;
      }, {} as HashMap<SearchState>),
    }));
  }

  isPageCached(pageNumber: number) {
    return Object.keys(this.resultsStore.getValue().pagination.pages).map(key => Number(key)).includes(pageNumber)
  }

  clearActiveCollections() {
    this.resultsStore.update(state => {
      const collections = {...state.collectionSearchStates};
      Object.entries(collections).forEach(([key, value]) => {
        collections[key] = {...value, active: false};
      });
      return {...state, collectionSearchStates: collections};
    })
  }
}

@Injectable({ providedIn: 'root' })
export class PrimaryResultsRepository extends ResultsRepository {
  constructor(@Inject(SEARCH_SET_LIST) sets: ISet[], _router: Router) {
    super('base', sets, _router);
  }
}
