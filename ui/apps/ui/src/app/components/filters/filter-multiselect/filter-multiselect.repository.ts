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

  // ASYNC
  readonly entitiesCount$ = this._store$.pipe(selectEntitiesCount());
  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly activeEntities$ = this._store$
    .pipe(selectActiveEntities())
    .pipe(map((entities) => entities.sort((a, b) => +b.count - +a.count)));
  readonly nonActiveEntities$ = this._store$
    .pipe(
      selectAllEntitiesApply({ filterEntity: ({ isSelected }) => !isSelected })
    )
    .pipe(map((entities) => entities.sort((a, b) => +b.count - +a.count)));

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
