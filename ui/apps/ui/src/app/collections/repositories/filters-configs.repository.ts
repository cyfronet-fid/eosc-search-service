import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { IExcludedFiltersConfig, IFiltersConfig } from './types';
import { DEFAULT_COLLECTION_ID, EXCLUDED_FILTERS, FILTERS } from '../data';

@Injectable({ providedIn: 'root' })
export class FiltersConfigsRepository {
  readonly _store$ = createStore(
    {
      name: `filters-configs`,
    },
    withEntities<IFiltersConfig>()
  );

  private readonly _excludedFiltersStore$ = createStore(
    {
      name: `excluded-filters-configs`,
    },
    withEntities<IExcludedFiltersConfig>()
  );

  constructor() {
    this._store$.update(setEntities(FILTERS));
    this._excludedFiltersStore$.update(setEntities(EXCLUDED_FILTERS));
  }

  get(urlPath: string | null | undefined | ''): IFiltersConfig {
    const id = urlPath ?? DEFAULT_COLLECTION_ID;
    const filtersConfig = this._store$.query(getEntity(id)) as IFiltersConfig;

    const excludedFiltersConfig = this._excludedFiltersStore$.query(
      getEntity(id)
    ) as IExcludedFiltersConfig;

    const filtersAfterExclusion = filtersConfig.filters.filter(
      (entry) => !excludedFiltersConfig.excluded.includes(entry.filter)
    );

    return {
      ...filtersConfig,
      filters: filtersAfterExclusion,
    };
  }
}
