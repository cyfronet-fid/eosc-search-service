import {HashMap} from '@eosc-search-service/types';
import {createStore, select, setProp, withProps} from '@ngneat/elf';
import {addEntities, selectAllEntities, setEntities, withEntities,} from '@ngneat/elf-entities';
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
import {
  clearSearchState,
  CollectionsSearchState,
  IFacetResponse,
  IResult,
  makeSearchState,
  SearchState
} from './results.model';

export const RESULTS_ROWS = 100;

export class ResultsRepository {
  protected _collectionsMap: HashMap<ICollectionSearchMetadata>;

  constructor(private _storeName = 'base', private sets: ISet[]) {
    this._initializeStoreCollection(this.sets);
    this._collectionsMap = {};
    this.sets.forEach((set) => {
      set.collections.forEach(
        (collection) => (this._collectionsMap[collection.type] = collection)
      );
    });
  }

  isLoading(): boolean {
    return (
      this.resultsStore.getValue().requestsStatus.results.value === 'pending'
    );
  }

  readonly resultsStore = createStore(
    {
      name: `results-${this._storeName}`,
    },
    withProps<CollectionsSearchState>({ collectionSearchStates: {} }),
    withEntities<IResult>(),
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
      Object.values(state.collectionSearchStates).some(
        (searchState) => searchState.hasNext
      )
    )
  );

  readonly resultsStatus$ = this.resultsStore.pipe(
    selectRequestStatus('results'),
    shareReplay({ refCount: true })
  );

  readonly loading$ = this.resultsStatus$.pipe(
    map((status) => status.value === 'pending')
  );

  readonly results$ = this.resultsStore.pipe(
    selectAllEntities(),
    shareReplay({ refCount: true })
  );

  readonly filters$: Observable<
    [
      ICollectionSearchMetadata<unknown>,
      { [facetName: string]: IFacetResponse }
    ][]
  > = this.resultsStore.pipe(
    select((state) => state.collectionSearchStates),
    map((searchStates) =>
      Object.entries(searchStates)
        .filter(([key, state]) => Object.keys(state.facets).length > 0)
        .map(([key, state]) => [this._collectionsMap[key], state.facets])
    )
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
}

@Injectable({ providedIn: 'root' })
export class PrimaryResultsRepository extends ResultsRepository {
  constructor(@Inject(SEARCH_SET_LIST) sets: ISet[]) {
    super('base', sets);
  }
}
