import { createStore, select, withProps } from '@ngneat/elf';
import {
  getActiveIds,
  getAllEntities,
  getAllEntitiesApply,
  getEntity,
  resetActiveIds,
  selectActiveEntities,
  selectAllEntitiesApply,
  selectEntitiesCount,
  setActiveIds,
  updateAllEntities,
  updateEntities,
  upsertEntities,
  withActiveIds,
  withEntities,
} from '@ngneat/elf-entities';
import { FilterTreeNode } from '../types';
import { Injectable } from '@angular/core';
import { uniqueId } from 'lodash-es';
import { BehaviorSubject, map, tap } from 'rxjs';
import { combineLatest } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';

const CHUNK_SIZE = 100;

@Injectable()
export class FilterMultiselectRepository {
  readonly _store$ = createStore(
    {
      name: `${uniqueId('current-filter')}`,
    },
    withEntities<FilterTreeNode>(),
    withProps<{ isLoading: boolean; query: string }>({
      query: '',
      isLoading: false,
    }),
    withActiveIds([])
  );

  // ASYNC
  readonly entitiesCount$ = this._store$.pipe(selectEntitiesCount());
  readonly activeEntities$ = this._store$.pipe(
    selectActiveEntities(),
    map((entities) => entities.sort((a, b) => +b.count - +a.count))
  );
  readonly chunkedNonActiveEntities$ = new BehaviorSubject<FilterTreeNode[]>(
    []
  );
  readonly nonActiveEntities$ = this._store$.pipe(
    selectAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected }),
    map((entities) => entities.sort((a, b) => +b.count - +a.count))
  );
  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly query$ = this._store$.pipe(select(({ query }) => query));
  readonly initNonActiveEntitiesChunk$ = combineLatest(
    this.query$,
    this.nonActiveEntities$
  ).pipe(
    map(([query, nonActiveEntities]) =>
      query !== ''
        ? new Fuse(nonActiveEntities, { keys: ['name'], shouldSort: false })
            .search(query)
            .map(({ item }) => item)
        : nonActiveEntities
    ),
    map((queryResults) => queryResults.slice(0, CHUNK_SIZE)),
    tap((queryResults) => this.chunkedNonActiveEntities$.next(queryResults))
  );

  // SYNC
  nonActiveEntities = () =>
    this._store$.query(
      getAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected })
    );
  entities = () => this._store$.query(getAllEntities());
  activeEntitiesIds = () => this._store$.query(getActiveIds);
  getEntity = (filter: Partial<FilterTreeNode> & { id: string }) =>
    this._store$.query(getEntity(filter.id));
  query = () => this._store$.query(({ query }) => query);

  // MUTATIONS
  upsertEntities = (filters: Array<Partial<FilterTreeNode> & { id: string }>) =>
    this._store$.update(upsertEntities(filters));
  resetAllEntitiesCounts = () =>
    this._store$.update(updateAllEntities({ count: '0' }));
  resetAllActiveEntities = () =>
    this._store$.update(
      updateAllEntities({ isSelected: false }),
      resetActiveIds()
    );

  setQuery = (query: string) =>
    this._store$.update((state) => ({
      ...state,
      query,
    }));
  setActiveIds = (activeIds: string[]) =>
    this._store$.update(
      setActiveIds(activeIds),
      updateEntities(activeIds, { isSelected: true })
    );
  setLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));

  loadNextNonActiveChunk = () => {
    const query = this.query();
    const allNonActiveEntities =
      query !== ''
        ? new Fuse(this.nonActiveEntities(), {
            keys: ['name'],
            shouldSort: false,
          })
            .search(query)
            .map(({ item }) => item)
        : this.nonActiveEntities();
    const chunk = this.chunkedNonActiveEntities$.value;
    const offset = chunk.length;
    const nextChunkAvailable = offset !== allNonActiveEntities.length;
    if (!nextChunkAvailable) {
      return;
    }

    this.chunkedNonActiveEntities$.next([
      ...chunk,
      ...allNonActiveEntities.slice(offset, offset + CHUNK_SIZE),
    ]);
  };
}
