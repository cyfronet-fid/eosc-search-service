import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  ICollectionSearchMetadata,
  IFacetBucket,
  IFacetParam,
  IFilterNode,
  ISolrCollectionParams,
  ISolrQueryParams,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { facetToFlatNodes } from '../utils';
import { Observable, map, tap } from 'rxjs';
import { paramType } from '@collections/services/custom-route.type';
import { CustomRoute } from '@collections/services/custom-route.service';
import {
  toFilterFacet,
  toSearchMetadata,
} from '@components/filters/filter-multiselect/utils';

@Injectable()
export class FilterMultiselectService {
  constructor(
    private _customRoute: CustomRoute,
    private _filterMultiselectRepository: FilterMultiselectRepository,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository
  ) {}

  isLoading$ = this._filterMultiselectRepository.isLoading$;
  allEntities$ = this._filterMultiselectRepository.allEntities$;
  entitiesCount$ = this._filterMultiselectRepository.entitiesCount$;
  hasEntities$ = this._filterMultiselectRepository.entitiesCount$.pipe(
    map((count) => count > 0)
  );
  hasShowMore$ = this._filterMultiselectRepository.hasShowMore$;

  isLoading = () => this._filterMultiselectRepository.isLoading();
  setLoading = (isLoading: boolean) =>
    this._filterMultiselectRepository.setLoading(isLoading);
  setActiveIds = (activeIds: string[]) =>
    this._filterMultiselectRepository.setActiveIds(activeIds);
  updateEntitiesCounts = (entities: IFilterNode[]) =>
    this._filterMultiselectRepository.updateEntitiesCounts(entities);
  setEntities = (entities: IFilterNode[]) =>
    this._filterMultiselectRepository.setEntities(entities);

  _fetchAllValues$(
    filter: string,
    collection: string,
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata('*', [], metadata),
      toFilterFacet(filter),
      mutator
    ).pipe(
      map(
        (entities) =>
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          entities.map(({ isSelected: _, ...other }) => ({
            ...other,
            count: '0',
          })) as unknown as IFilterNode[]
      )
    );
  }
  _fetchCounts$(
    filter: string,
    routerParams: { [param: string]: paramType },
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<{ id: string; count: string }[]> {
    const metadata = this._searchMetadataRepository.get(
      routerParams['collection'] as string
    );
    const q = routerParams['q'] as string;
    const fq = routerParams['fq'] as string[];

    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata(q, fq, metadata),
      toFilterFacet(filter),
      mutator
    ).pipe(map((entities) => entities.map(({ id, count }) => ({ id, count }))));
  }
  private _fetchTreeNodes$(
    filter: string,
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: IFacetParam },
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) =>
          mutator
            ? mutator(facets[filter]?.buckets || [])
            : facetToFlatNodes(facets[filter]?.buckets, filter)
        ),
        map(
          (nodes) =>
            nodes.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ isSelected: _, ...other }) => other
            ) as IFilterNode[]
        )
      );
  }
}
