import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  ICollectionSearchMetadata,
  IFacetParam,
  ISolrCollectionParams,
  ISolrQueryParams,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { facetToTreeNodes } from '../utils';
import { map, tap } from 'rxjs';
import { paramType } from '@collections/services/custom-route.type';
import { CustomRoute } from '@collections/services/custom-route.service';
import {
  toFilterFacet,
  toSearchMetadata,
} from '@components/filters/filter-multiselect/utils';

const DEFAULT_RESULTS_SIZE = 10;

@Injectable()
export class FilterMultiselectService {
  constructor(
    private _customRoute: CustomRoute,
    private _filterMultiselectRepository: FilterMultiselectRepository,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository
  ) {}

  isLoading$ = this._filterMultiselectRepository.isLoading$;
  activeEntities$ = this._filterMultiselectRepository.activeEntities$;
  nonActiveEntities$ = this._filterMultiselectRepository.nonActiveEntities$;
  entitiesCount$ = this._filterMultiselectRepository.entitiesCount$;
  hasEntities$ = this._filterMultiselectRepository.entitiesCount$.pipe(
    map((count) => count > 0)
  );
  hasShowMore$ = this._filterMultiselectRepository.nonActiveEntities$.pipe(
    map(({ length }) => length > DEFAULT_RESULTS_SIZE)
  );

  setActiveIds = (activeIds: string[]) =>
    this._filterMultiselectRepository.setActiveIds(activeIds);
  setQuery = (query: string) =>
    this._filterMultiselectRepository.setQuery(query);

  _loadAllAvailableValues$(filter: string, collection: string) {
    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata('*', [], metadata),
      toFilterFacet(filter, metadata.facets)
    );
  }
  _updateCounts$(filter: string, routerParams: { [param: string]: paramType }) {
    const metadata = this._searchMetadataRepository.get(
      routerParams['collection'] as string
    );
    const q = routerParams['q'] as string;
    const fq = routerParams['fq'] as string[];

    this._filterMultiselectRepository.resetAllEntitiesCounts();

    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata(q, fq, metadata),
      toFilterFacet(filter, metadata.facets)
    );
  }
  _fetchTreeNodes$(
    filter: string,
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: IFacetParam }
  ) {
    this._filterMultiselectRepository.setLoading(true);
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) => facetToTreeNodes(facets[filter], filter)),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map((nodes) => nodes.map(({ isSelected, ...other }) => other)),
        tap((nodes) => this._filterMultiselectRepository.upsertEntities(nodes)),
        tap(() => this._filterMultiselectRepository.setLoading(false))
      );
  }
}
