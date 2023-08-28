import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  ICollectionSearchMetadata,
  IFacetBucket,
  IFilterNode,
  ISolrCollectionParams,
  ISolrQueryParams,
  ITermsFacetParam,
  ITermsFacetResponse,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { facetToFlatNodes, toSearchMetadata } from '../utils';
import { Observable, map } from 'rxjs';
import { paramType } from '@collections/services/custom-route.type';
import { CustomRoute } from '@collections/services/custom-route.service';
import { toFilterFacet } from '@components/filters/filter-multiselect/utils';

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

  getFiltersFromTags(
    tags: string[] | string,
    radioValueAuthor: string,
    radioValueExact: string,
    radioValueTitle: string,
    radioValueKeyword: string
  ) {
    let filters: string[] = [];

    const authors: number[] = [];
    const exacts: number[] = [];
    const titles: number[] = [];
    const keywords: number[] = [];
    const allIndexes: number[] = [];

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
            authors.push(filters.length - 1);
          } else {
            // We need OR case
            let fin = '';
            res_permuted.forEach((el: string) => {
              fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
            });
            filters.push(fin.slice(0, fin.length - 4));
            authors.push(filters.length - 1);
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
          exacts.push(filters.length - 1);
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
          titles.push(filters.length - 1);
        }
        if (tag.startsWith('keyword:')) {
          filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
          keywords.push(filters.length - 1);
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
          authors.push(filters.length - 1);
        } else {
          // We need OR case
          let fin = '';
          res_permuted.forEach((el: string) => {
            fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
          });
          filters.push(fin.slice(0, fin.length - 4));
          authors.push(filters.length - 1);
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
        exacts.push(filters.length - 1);
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
        titles.push(filters.length - 1);
      }
      if (tag.startsWith('keyword:')) {
        filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        keywords.push(filters.length - 1);
      }
    }

    if (radioValueAuthor === 'B') {
      let new_aut = '';
      for (const author of authors) {
        new_aut += filters[author] + ' OR ';
        allIndexes.push(author);
      }
      new_aut = new_aut.slice(0, new_aut.length - 4);
      filters.push(new_aut);
    }
    if (radioValueExact === 'B') {
      let new_exc = '';
      for (const exactel of exacts) {
        new_exc += filters[exactel] + ' OR ';
        allIndexes.push(exactel);
      }
      new_exc = new_exc.slice(0, new_exc.length - 4);
      filters.push(new_exc);
    }
    if (radioValueTitle === 'B') {
      let new_title = '';
      for (const exactit of titles) {
        new_title += filters[exactit] + ' OR ';
        allIndexes.push(exactit);
      }
      new_title = new_title.slice(0, new_title.length - 4);
      filters.push(new_title);
    }
    if (radioValueKeyword === 'B') {
      let new_keyword = '';
      for (const keywordel of keywords) {
        new_keyword += filters[keywordel] + ' OR ';
        allIndexes.push(keywordel);
      }
      new_keyword = new_keyword.slice(0, new_keyword.length - 4);
      filters.push(new_keyword);
    }

    filters = filters.filter((value, index) => !allIndexes.includes(index));

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
    const exact = routerParams['exact'] as string;
    const radioValueAuthor = routerParams['radioValueAuthor'] as string;
    const radioValueExact = routerParams['radioValueExact'] as string;
    const radioValueTitle = routerParams['radioValueTitle'] as string;
    const radioValueKeyword = routerParams['radioValueKeyword'] as string;

    const filters = this.getFiltersFromTags(
      tags,
      radioValueAuthor,
      radioValueExact,
      radioValueTitle,
      radioValueKeyword
    );
    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata('*', exact, filters, metadata),
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
    const exact = routerParams['exact'] as string;
    const radioValueAuthor = routerParams['radioValueAuthor'] as string;
    const radioValueExact = routerParams['radioValueExact'] as string;
    const radioValueTitle = routerParams['radioValueTitle'] as string;
    const radioValueKeyword = routerParams['radioValueKeyword'] as string;

    const filters = this.getFiltersFromTags(
      tags,
      radioValueAuthor,
      radioValueExact,
      radioValueTitle,
      radioValueKeyword
    );
    const fq_m = fq.concat(filters);

    return this._fetchTreeNodes$(
      filter,
      toSearchMetadata(q, exact, fq_m, metadata),
      toFilterFacet(filter),
      mutator
    ).pipe(map((entities) => entities.map(({ id, count }) => ({ id, count }))));
  }
  private _fetchTreeNodes$(
    filter: string,
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: ITermsFacetParam },
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) => {
          const filterFacets = facets[filter] as ITermsFacetResponse;

          return mutator
            ? mutator(filterFacets?.buckets || [])
            : facetToFlatNodes(filterFacets?.buckets, filter);
        }),
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
