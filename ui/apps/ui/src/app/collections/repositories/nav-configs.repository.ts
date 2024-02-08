import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  getAllEntities,
  getEntity,
  selectActiveEntity,
  setActiveId,
  setEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { ICollectionNavConfig } from './types';
import { DEFAULT_COLLECTION_ID, NAV_CONFIGS } from '../data';
import {
  BETA_ONLY_COLLECTIONS,
  SPECIAL_COLLECTIONS,
} from '@collections/data/config';
import { ConfigService } from '../../services/config.service';

@Injectable({ providedIn: 'root' })
export class NavConfigsRepository {
  readonly _store$ = createStore(
    {
      name: `nav-configs`,
    },
    withEntities<ICollectionNavConfig>(),
    withActiveId(undefined)
  );

  constructor() {
    this._store$.update(setEntities(NAV_CONFIGS));
  }

  readonly activeEntity$ = this._store$.pipe(selectActiveEntity());

  get(urlPath: string | null | undefined | '') {
    return this._store$.query(getEntity(urlPath ?? DEFAULT_COLLECTION_ID));
  }

  getAll() {
    const allCollections = this._store$.query(getAllEntities());
    if (!ConfigService.config.show_beta_collections) {
      return allCollections.filter(
        (collection) => !BETA_ONLY_COLLECTIONS.includes(collection.id)
      );
    }
    return allCollections;
  }

  getResourcesCollections() {
    const allCollections = this._store$.query(getAllEntities());
    return allCollections.filter(
      (collection) => !SPECIAL_COLLECTIONS.includes(collection.id)
    );
  }

  setActive(navConf: Partial<ICollectionNavConfig> & { id: string }) {
    this._store$.update(setActiveId(navConf.id));
  }
}
