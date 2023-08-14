import { Injectable } from '@angular/core';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  IFilterNode,
  ISolrCollectionParams,
  ISolrQueryParams,
  ITermsFacetParam,
  ITermsFacetResponse,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { Observable, map } from 'rxjs';
import { facetToFlatNodes } from '@components/filters/utils';

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository
  ) {}

  fetchTreeNodes$(
    filters: string[],
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: ITermsFacetParam }[]
    // mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[],
  ): Observable<{ id: string; options: IFilterNode[] }[]> {
    const fetchedFacets = this._fetchDataService
      .fetchFilters$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) => {
          return filters.map((filter) => {
            const filterFacets = facets[filter] as ITermsFacetResponse;
            return {
              id: filter,
              options: facetToFlatNodes(filterFacets?.buckets ?? [], filter),
            };
          });
        })
      );

    return fetchedFacets;
  }

  get searchMetadataRepository(): SearchMetadataRepository {
    return this._searchMetadataRepository;
  }
}
