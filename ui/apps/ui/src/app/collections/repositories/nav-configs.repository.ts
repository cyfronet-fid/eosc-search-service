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
    return this._store$
      .query(getAllEntities())
      .filter((nav) => nav.id !== 'provider');
  }

  setActive(navConf: Partial<ICollectionNavConfig> & { id: string }) {
    this._store$.update(setActiveId(navConf.id));
  }
}
