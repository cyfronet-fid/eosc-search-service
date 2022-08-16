import { createStore, select, withProps } from '@ngneat/elf';
import {
  getActiveIds,
  getAllEntities,
  getAllEntitiesApply,
  getEntity,
  resetActiveIds,
  selectActiveEntities,
  selectAllEntitiesApply,
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

const CHUNK_SIZE = 100;

@Injectable()
export class FilterMultiselectRepository {
  readonly _store$ = createStore(
    {
      name: `${uniqueId('current-filter')}`,
    },
    withEntities<FilterTreeNode>(),
    withProps<{ isLoading: boolean }>({
      isLoading: false,
    }),
    withActiveIds([])
  );

  readonly activeEntities$ = this._store$.pipe(
    selectActiveEntities(),
    map((entities) => entities.sort((a, b) => +b.count - +a.count))
  );
  readonly chunkedNonActiveEntities$ = new BehaviorSubject<FilterTreeNode[]>(
    []
  );
  readonly nonActiveEntities$ = this._store$.pipe(
    selectAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected }),
    map((entities) => entities.sort((a, b) => +b.count - +a.count)),
    tap((sortedEntities) =>
      this.chunkedNonActiveEntities$.next(sortedEntities.slice(0, CHUNK_SIZE))
    )
  );
  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));

  loadNextNonActiveChunk = () => {
    const allNonActiveEntities = this.nonActiveEntities();
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
  nonActiveEntities = () =>
    this._store$.query(
      getAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected })
    );
  entities = () => this._store$.query(getAllEntities());
  activeEntitiesIds = () => this._store$.query(getActiveIds);
  getEntity = (filter: Partial<FilterTreeNode> & { id: string }) =>
    this._store$.query(getEntity(filter.id));

  upsertEntities = (filters: Array<Partial<FilterTreeNode> & { id: string }>) =>
    this._store$.update(upsertEntities(filters));
  resetAllEntitiesCounts = () =>
    this._store$.update(updateAllEntities({ count: '0' }));
  resetAllActiveEntities = () =>
    this._store$.update(
      updateAllEntities({ isSelected: false }),
      resetActiveIds()
    );

  setActiveIds = (
    ...filters: Array<Partial<FilterTreeNode> & { id: string }>
  ) =>
    this._store$.update(
      setActiveIds(filters.map(({ id }) => id)),
      updateEntities(
        filters.map(({ id }) => id),
        { isSelected: true }
      )
    );
  setLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));
  isLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));
}
