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
import {
  DEFAULT_COLLECTION_ID,
  PL_SEARCH_METADATA,
  SEARCH_METADATA,
} from '../data';

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
    const metadata =
      localStorage.getItem('COLLECTIONS_PREFIX') === 'pl'
        ? PL_SEARCH_METADATA
        : SEARCH_METADATA;
    this._store$.update(setEntities(metadata));
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
