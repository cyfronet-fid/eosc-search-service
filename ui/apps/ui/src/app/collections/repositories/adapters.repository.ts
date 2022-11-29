import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { IAdapter } from './types';
import { ADAPTERS, DEFAULT_COLLECTION_ID } from '../data';

@Injectable({ providedIn: 'root' })
export class AdaptersRepository {
  readonly _store$ = createStore(
    {
      name: `adapters`,
    },
    withEntities<IAdapter>()
  );

  constructor() {
    this._store$.update(setEntities(ADAPTERS));
  }

  get(urlPath: string | null | undefined | '') {
    return this._store$.query(getEntity(urlPath ?? DEFAULT_COLLECTION_ID));
  }
}
