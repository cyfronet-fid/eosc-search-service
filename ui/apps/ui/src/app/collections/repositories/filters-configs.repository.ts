import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { IFiltersConfig } from './types';
import { DEFAULT_COLLECTION_ID, FILTERS } from '../data';

@Injectable({ providedIn: 'root' })
export class FiltersConfigsRepository {
  readonly _store$ = createStore(
    {
      name: `filters-configs`,
    },
    withEntities<IFiltersConfig>()
  );

  constructor() {
    this._store$.update(setEntities(FILTERS));
  }

  get = (urlPath: string | null | undefined | ''): IFiltersConfig =>
    this._store$.query(
      getEntity(urlPath ?? DEFAULT_COLLECTION_ID)
    ) as IFiltersConfig;
}
