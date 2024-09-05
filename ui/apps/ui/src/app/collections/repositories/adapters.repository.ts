import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { IAdapter } from './types';
import { ADAPTERS, DEFAULT_COLLECTION_ID, PL_ADAPTERS } from '../data';

@Injectable({ providedIn: 'root' })
export class AdaptersRepository {
  readonly _store$ = createStore(
    {
      name: `adapters`,
    },
    withEntities<IAdapter>()
  );

  constructor() {
    const adapters =
      localStorage.getItem('COLLECTIONS_PREFIX') === 'pl'
        ? PL_ADAPTERS
        : ADAPTERS;
    this._store$.update(setEntities(adapters));
  }

  get(urlPath: string | null | undefined | '') {
    return this._store$.query(getEntity(urlPath ?? DEFAULT_COLLECTION_ID));
  }
}
