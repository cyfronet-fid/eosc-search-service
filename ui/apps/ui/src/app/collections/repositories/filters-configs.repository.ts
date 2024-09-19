import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { ActivatedRoute } from '@angular/router';
import {
  FiltersStoreConfig,
  IExcludedFiltersConfig,
  IFilterConfigUI,
  IFilterNode,
  IFiltersConfig,
  filterUIEntitiesRef,
  withFilterUIEntities,
} from './types';
import {
  DEFAULT_COLLECTION_ID,
  EXCLUDED_FILTERS,
  FILTERS,
  PL_EXCLUDED_FILTERS,
  PL_FILTERS,
} from '../data';
import { filterValueType } from '@collections/services/custom-route.type';
import { mutateUiValue } from '@components/active-filters/utils';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FiltersConfigsRepository {
  readonly _store$ = createStore(
    {
      name: `filters-configs`,
    },
    withProps<FiltersStoreConfig>({ loading: true }),
    withEntities<IFiltersConfig>(),
    withFilterUIEntities<IFilterConfigUI>()
  );

  private readonly _excludedFiltersStore$ = createStore(
    {
      name: `excluded-filters-configs`,
    },
    withEntities<IExcludedFiltersConfig>()
  );

  public readonly isLoading$ = this._store$.pipe(map((state) => state.loading));

  constructor(private _route: ActivatedRoute) {
    this.setScope();
  }

  get(urlPath: string | null | undefined | ''): IFiltersConfig {
    const id = urlPath ?? DEFAULT_COLLECTION_ID;
    const config = this._store$.query(getEntity(id)) as IFiltersConfig;
    const filtersConfig =
      config ||
      (this._store$.query(getEntity(DEFAULT_COLLECTION_ID)) as IFiltersConfig);
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

  setFilterNodes(
    collection: string,
    nodes: { id: string; options: IFilterNode[] }[],
    selected: { [id: string]: filterValueType }
  ) {
    this._store$.update(
      setEntities(
        nodes.map((node) => {
          const filterConfig = this._store$
            .query(getEntity(collection))
            ?.filters.find((fc) => fc.id === node.id);

          const options = node.options.map((op) => {
            const r = {
              ...op,
              isSelected: Array.isArray(selected[node.id])
                ? selected[node.id].includes(op.id)
                : false,
              name:
                filterConfig === undefined
                  ? op.name
                  : mutateUiValue(filterConfig, op.name),
            };
            return r;
          });

          if (filterConfig?.customSort != null) {
            options.sort(filterConfig?.customSort);
          }

          return { ...node, options };
        }),
        { ref: filterUIEntitiesRef }
      ),
      (state) => ({ ...state, loading: false })
    );
  }

  setLoading(loading: boolean) {
    this._store$.update((state) => ({ ...state, loading }));
  }

  setScope() {
    const scope = this._route.snapshot.queryParamMap.get('scope') || '';
    const filters = scope === 'eu' ? FILTERS : PL_FILTERS;
    const excluded = scope === 'eu' ? EXCLUDED_FILTERS : PL_EXCLUDED_FILTERS;
    this._excludedFiltersStore$.update(setEntities(excluded));
    this._store$.update(
      (state) => ({ ...state }),
      setEntities(filters),
      setEntities([], { ref: filterUIEntitiesRef })
    );
  }
}
