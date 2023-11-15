import { Injectable } from '@angular/core';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  IFilterConfig,
  IFilterNode,
  ISolrCollectionParams,
  ISolrQueryParams,
  ITermsFacetParam,
  ITermsFacetResponse,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { Observable, mergeMap } from 'rxjs';
import { facetToFlatNodes } from '@components/filters/utils';
import {
  removeFilterValue,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { IFqMap } from '@collections/services/custom-route.type';

type OriginalStructure = {
  [field: string]: number | ITermsFacetResponse;
};

type ConvertedStructure = {
  [key: string]: string[];
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  constructor(
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  convertFacets(facets: OriginalStructure): ConvertedStructure {
    const result: ConvertedStructure = {};

    for (const key in facets) {
      const facet = facets[key];
      if (typeof facet !== 'number' && 'buckets' in facet) {
        // Zakładamy, że facet.buckets.map zwraca (string | number)[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result[key] = facet.buckets.map((bucket: { val: any }) => bucket.val);
      }
    }

    return result;
  }

  /*fetchTreeNodes$(
    filters: string[],
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: ITermsFacetParam }[]
  ): Observable<{ id: string; options: IFilterNode[] }[]> {
    let fqMap: IFqMap = {};
    const allFilters = this._filtersConfigsRepository.get(
      this._route.snapshot.queryParamMap.get('collection')
    ).filters;
    const fetchedFacets = this._fetchDataService
      .fetchFilters$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) => {
          const converted = this.convertFacets(facets);
          for (const [key, values] of Object.entries(converted)) {
            values.forEach((value) => {
              const fq = addFilterValue(fqMap, allFilters, key, value);
              fqMap = serializeAll(fq, allFilters);
            });
          }
          console.log(fqMap);
          // Bazujac na tej mapie
          /*
          best_access_right : ['Open access']
          language: ['Not specified']
          scientific_domains: (4) ['Engineering & Technology', 'Engineering & Technology>Medical Engineering', 'Medical & Health Sciences', 'Medical & Health Sciences>Clinical Medicine']
          */
  /*
          return filters.map((filter) => {
            const filterFacets = facets[filter] as ITermsFacetResponse;
            const nodes = facetToFlatNodes(filterFacets?.buckets ?? [], filter);
            return {
              id: filter,
              options: transformNodes ? transformNodes(nodes) : nodes,
            };
          });
        })
      );
    console.log('final map');
    console.log(fqMap);
    /*this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, allFilters),
      },
      queryParamsHandling: 'merge',
    });*/
  /*
    return fetchedFacets;
  }
  */

  fetchTreeNodes$(
    filters: IFilterConfig[],
    params: ISolrCollectionParams & ISolrQueryParams,
    facetsParams: { [facet: string]: ITermsFacetParam }[]
  ): Observable<{ id: string; options: IFilterNode[] }[]> {
    return this._fetchDataService
      .fetchFilters$<unknown & { id: string }>(params, facetsParams)
      .pipe(
        mergeMap(async (fetchedFacets) => {
          const allFilters = this._filtersConfigsRepository.get(
            this._route.snapshot.queryParamMap.get('collection')
          ).filters;

          const converted = this.convertFacets(fetchedFacets);
          let fqMap: IFqMap = {};

          for (const [key, values] of Object.entries(converted)) {
            values.forEach((value) => {
              const fq = removeFilterValue(fqMap, key, value, allFilters);
              fqMap = serializeAll(fq, allFilters);
            });
          }

          return filters.map((filter) => {
            const id = filter.filter;
            const filterFacets = fetchedFacets[id] as ITermsFacetResponse;
            const options = facetToFlatNodes(filterFacets?.buckets ?? [], id);

            return {
              id,
              options: filter.transformNodes
                ? filter.transformNodes(options)
                : options,
            };
          });
        })
      );
  }

  get searchMetadataRepository(): SearchMetadataRepository {
    return this._searchMetadataRepository;
  }
}
