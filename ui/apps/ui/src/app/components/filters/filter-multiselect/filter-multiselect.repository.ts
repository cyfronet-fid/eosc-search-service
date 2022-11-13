import { createStore, select, withProps } from '@ngneat/elf';
import {
  resetActiveIds,
  selectAllEntities,
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
import { Injectable } from '@angular/core';
import { uniqueId } from 'lodash-es';
import { map } from 'rxjs';
import { IFilterNode } from '@collections/repositories/types';

const DEFAULT_RESULTS_SIZE = 10;

@Injectable()
export class FilterMultiselectRepository {
  readonly _store$ = createStore(
    {
      name: `${uniqueId('current-filter')}`,
    },
    withEntities<IFilterNode>(),
    withProps<{ isLoading: boolean }>({
      isLoading: false,
    }),
    withActiveIds([])
  );

  // ASYNC
  readonly entitiesCount$ = this._store$.pipe(selectEntitiesCount());
  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly hasShowMore$ = this._store$.pipe(
    selectAllEntitiesApply({ filterEntity: ({ level }) => level === 0 }),
    map(({ length }) => length > DEFAULT_RESULTS_SIZE)
  );
  readonly allEntities$ = this._store$.pipe(selectAllEntities());

  // SYNC
  isLoading = () => this._store$.query(({ isLoading }) => isLoading);

  // MUTATIONS
  updateEntitiesCounts = (
    filters: Array<Partial<IFilterNode> & { id: string; count: string }>
  ) => {
    this._store$.update(
      updateAllEntities({ count: '0' }),
      upsertEntities(filters)
    );
  };
  setEntities = (filters: IFilterNode[]) => {
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
