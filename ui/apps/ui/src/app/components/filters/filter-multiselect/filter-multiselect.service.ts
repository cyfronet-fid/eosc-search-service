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
import { Observable, map } from 'rxjs';
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

  generatePermutations(words: string[]): string[] {
    const permutations: string[] = [];
    function backtrack(startIndex: number) {
      if (startIndex === words.length - 1) {
        permutations.push(words.join(' '));
        return;
      }

      for (let i = startIndex; i < words.length; i++) {
        [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Swap words
        backtrack(startIndex + 1);
        [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Restore original order
      }
    }

    backtrack(0);
    return permutations;
  }

  getFiltersFromTags(tags: string[] | string) {
    const filters: string[] = [];

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (tag.startsWith('author:')) {
          const aut = tag.split(':', 2)[1].trim();
          const splitted = aut.split(' ');
          const query_param: string[] = [];
          splitted.forEach((el: string) => {
            if (el.trim() !== '') {
              query_param.push(el.trim());
            }
          });
          const res_permuted = this.generatePermutations(query_param);
          if (res_permuted.length === 1) {
            filters.push('author_names_tg:"' + res_permuted[0].trim() + '"');
          } else {
            // We need OR case
            let fin = '';
            res_permuted.forEach((el: string) => {
              fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
            });
            filters.push(fin.slice(0, fin.length - 4));
          }
        }
        if (tag.startsWith('exact:')) {
          filters.push(
            'title:"' +
              tag.split(':', 2)[1].trim() +
              '" OR author_names_tg:"' +
              tag.split(':', 2)[1].trim() +
              '" OR description:"' +
              tag.split(':', 2)[1].trim() +
              '" OR keywords_tg:"' +
              tag.split(':', 2)[1].trim() +
              '" OR tag_list_tg:"' +
              tag.split(':', 2)[1].trim() +
              '"'
          );
        }
        if (tag.startsWith('none of:')) {
          filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
          filters.push(
            '!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"'
          );
          filters.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
          filters.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
          filters.push('!tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"');
        }
        if (tag.startsWith('in title:')) {
          filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
        }
      }
    } else {
      const tag: string = tags;
      if (tag.startsWith('author:')) {
        const aut = tag.split(':', 2)[1].trim();
        const splitted = aut.split(' ');
        const query_param: string[] = [];
        splitted.forEach((el: string) => {
          if (el.trim() !== '') {
            query_param.push(el.trim());
          }
        });
        const res_permuted = this.generatePermutations(query_param);
        if (res_permuted.length === 1) {
          filters.push('author_names_tg:"' + res_permuted[0].trim() + '"');
        } else {
          // We need OR case
          let fin = '';
          res_permuted.forEach((el: string) => {
            fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
          });
          filters.push(fin.slice(0, fin.length - 4));
        }
      }
      if (tag.startsWith('exact:')) {
        filters.push(
          'title:"' +
            tag.split(':', 2)[1].trim() +
            '" OR author_names_tg:"' +
            tag.split(':', 2)[1].trim() +
            '" OR description:"' +
            tag.split(':', 2)[1].trim() +
            '" OR keywords_tg:"' +
            tag.split(':', 2)[1].trim() +
            '" OR tag_list_tg:"' +
            tag.split(':', 2)[1].trim() +
            '"'
        );
      }
      if (tag.startsWith('none of:')) {
        filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"');
      }
      if (tag.startsWith('in title:')) {
        filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
      }
    }

    return filters;
  }

  _fetchAllValues$(
    filter: string,
    routerParams: { [param: string]: paramType },
    collection: string,
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    const tags = routerParams['tags'] as string[] | string;

    const filters = this.getFiltersFromTags(tags);
    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata('*', filters, metadata),
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
    const tags = routerParams['tags'] as string[] | string;

    const filters = this.getFiltersFromTags(tags);
    const fq_m = fq.concat(filters);

    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata(q, fq_m, metadata),
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
