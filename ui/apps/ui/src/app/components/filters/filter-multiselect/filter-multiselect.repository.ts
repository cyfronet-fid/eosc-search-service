import { createStore, select, withProps } from '@ngneat/elf';
import {
  resetActiveIds,
  selectActiveEntities,
  selectAllEntitiesApply,
  selectEntitiesCount,
  setActiveIds,
  setEntities,
  updateAllEntities,
  updateEntities,
  upsertEntities,
  withActiveIds,
  withEntities,
} from '@ngneat/elf-entities';
import { FilterTreeNode } from '../types';
import { Injectable } from '@angular/core';
import { uniqueId } from 'lodash-es';
import { map } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';
import { combineLatest } from 'rxjs';

const search = (query: string, entities: FilterTreeNode[]) => {
  if (!query || query.trim() === '') {
    return entities;
  }

  return new Fuse(entities, {
    keys: ['name'],
    shouldSort: false,
  })
    .search(query)
    .map(({ item }) => item);
};

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
  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly query$ = this._store$.pipe(select(({ query }) => query));
  readonly activeEntities$ = combineLatest(
    this._store$.pipe(selectActiveEntities()),
    this.query$
  ).pipe(
    map(([entities, query]) => search(query, entities)),
    map((entities) => entities.sort((a, b) => +b.count - +a.count))
  );
  readonly nonActiveEntities$ = combineLatest(
    this._store$.pipe(
      selectAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected })
    ),
    this.query$
  ).pipe(
    map(([entities, query]) => search(query, entities)),
    map((entities) => entities.sort((a, b) => +b.count - +a.count))
  );

  // SYNC
  isLoading = () => this._store$.query(({ isLoading }) => isLoading);

  // MUTATIONS
  updateEntitiesCounts = (
    filters: Array<Partial<FilterTreeNode> & { id: string; count: string }>
  ) => {
    this._store$.update(
      updateAllEntities({ count: '0' }),
      upsertEntities(filters)
    );
  };
  setEntities = (filters: FilterTreeNode[]) => {
    this._store$.update(setEntities(filters));
  };
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
  setActiveIds = (activeIds: string[]) => {
    this._store$.update(
      setActiveIds(activeIds),
      updateAllEntities({ isSelected: false }),
      updateEntities(activeIds, { isSelected: true })
    );
  };
  setLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));
}
