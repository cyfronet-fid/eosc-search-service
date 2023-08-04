import { Injectable } from '@angular/core';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  IFacetBucket,
  IFilterNode,
  ISolrCollectionParams,
  ISolrQueryParams,
  ITermsFacetParam,
  ITermsFacetResponse,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { Observable, map, merge } from 'rxjs';
import { facetToFlatNodes } from '@components/filters/utils';
import { CustomRoute } from '@collections/services/custom-route.service';

@Injectable()
export class FilterService {
  private cache: { [key: string]: Observable<IFilterNode[]> } = {};

  constructor(
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _customRoute: CustomRoute
  ) {}

  fetchTreeNodes$(
    filters: string[],
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: ITermsFacetParam }[],
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    if (filters.length === 1) {
      const cacheKey = this.getCacheKey(filters[0], params);
      return this.cache[cacheKey];
    }

    const observables: Observable<IFilterNode[]>[] = [];

    const fetchedFacets = this._fetchDataService.fetchFacets$<
      unknown & { id: string }
    >(params, facets);

    filters.forEach((filter) => {
      const observable = fetchedFacets.pipe(
        map((facets) => {
          const filterFacets = facets[filter] as ITermsFacetResponse;
          return mutator
            ? mutator(filterFacets?.buckets || [])
            : facetToFlatNodes(filterFacets?.buckets, filter);
        }),
        map(
          (nodes) =>
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            nodes.map(({ isSelected: _, ...other }) => other) as IFilterNode[]
        )
      );

      observables.push(observable);
    });

    const mergedObservables = merge(...observables);

    filters.forEach((filter, index) => {
      const cacheKey = this.getCacheKey(filter, params);
      this.cache[cacheKey] = observables[index];
    });

    return mergedObservables;
  }

  public clearCache() {
    this.cache = {};
  }

  private getCacheKey(
    filter: string,
    params: ISolrCollectionParams & ISolrQueryParams
  ): string {
    return filter.concat('_').concat(params.collection);
  }

  get searchMetadataRepository(): SearchMetadataRepository {
    return this._searchMetadataRepository;
  }

  get customRoute(): CustomRoute {
    return this._customRoute;
  }
}
