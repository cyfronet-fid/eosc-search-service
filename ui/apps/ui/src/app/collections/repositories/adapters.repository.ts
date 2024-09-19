import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { IAdapter } from './types';
import { ADAPTERS, DEFAULT_COLLECTION_ID, PL_ADAPTERS } from '../data';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdaptersRepository {
  readonly _store$ = createStore(
    {
      name: `adapters`,
    },
    withEntities<IAdapter>()
  );

  constructor(private _route: ActivatedRoute) {
    this.setScope();
  }

  setScope() {
    const scope = this._route.snapshot.queryParamMap.get('scope');
    const adapters = scope === 'eu' ? ADAPTERS : PL_ADAPTERS;
    this._store$.update(setEntities(adapters));
  }

  get(urlPath: string | null | undefined | '') {
    this.setScope();
    return this._store$.query(getEntity(urlPath ?? DEFAULT_COLLECTION_ID));
  }
}
