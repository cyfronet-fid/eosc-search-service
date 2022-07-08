import { createStore } from '@ngneat/elf';
import {
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { withRequestsStatus } from '@ngneat/elf-requests';
import { addFacetsToFilter, IFilter } from './filters.model';
import { HashMap } from '@eosc-search-service/types';
import { ICollectionSearchMetadata, SearchState } from '../results';
import { getFqsFromUrl } from '../../utils';
import { Injectable } from '@angular/core';
import { IFacetResponse, INITIAL_FILTER_OPTION_COUNT } from '../common';

@Injectable({ providedIn: 'root' })
export class FiltersRepository {
  constructor() {}

  readonly store = createStore(
    {
      name: `filters-base`,
    },
    withEntities<IFilter>(),
    withRequestsStatus<'filters'>()
  );

  readonly entries$ = this.store.pipe(selectAllEntities());

  intialize(
    collectionsMap: HashMap<ICollectionSearchMetadata>,
    searchStates: HashMap<SearchState>,
    url: string
  ): void {
    const filters: [
      ICollectionSearchMetadata<unknown>,
      { [facetName: string]: IFacetResponse }
    ][] = Object.entries(searchStates)
      .filter(([key, state]) => Object.keys(state.facets).length > 0)
      .map(([key, state]) => [collectionsMap[key], state.facets]);

    const filtersTree: IFilter[] = [];
    const fqs = getFqsFromUrl(url);
    filters.forEach(([collection, facets]) =>
      addFacetsToFilter(collection, facets, filtersTree, fqs)
    );

    this.store.update(setEntities(filtersTree));
  }
}
