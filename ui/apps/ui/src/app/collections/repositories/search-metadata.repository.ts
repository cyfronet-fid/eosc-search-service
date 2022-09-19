import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  getAllEntities,
  getEntity,
  setEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { ICollectionSearchMetadata } from './types';
import { DEFAULT_COLLECTION_ID, SEARCH_METADATA } from '../data';

@Injectable({ providedIn: 'root' })
export class SearchMetadataRepository {
  readonly _store$ = createStore(
    {
      name: `search-metadata`,
    },
    withEntities<ICollectionSearchMetadata>(),
    withActiveId(undefined)
  );

  constructor() {
    this._store$.update(setEntities(SEARCH_METADATA));
  }

  get(urlPath: string | null | undefined | '') {
    return this._store$.query(
      getEntity(urlPath ?? DEFAULT_COLLECTION_ID)
    ) as ICollectionSearchMetadata;
  }

  getAll() {
    return this._store$.query(getAllEntities());
  }
}
