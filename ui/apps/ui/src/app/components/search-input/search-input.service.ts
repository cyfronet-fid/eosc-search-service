import { Injectable } from '@angular/core';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { combineLatest, map, of } from 'rxjs';
import {
  ICollectionSearchMetadata,
  adapterType,
} from '@collections/repositories/types';
import { toSuggestedResults, toSuggestedResultsAdv } from './utils';
import { URL_PARAM_NAME } from '@collections/data/all/nav-config.data';
import {
  queryChanger,
  queryChangerAdv,
} from '@collections/filters-serializers/utils';

const MAX_COLLECTION_RESULTS = 3; // TODO: Move to env file

@Injectable({
  providedIn: 'root',
})
export class SearchInputService {
  constructor(
    private _adaptersRepository: AdaptersRepository,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _fetchDataService: FetchDataService
  ) {}

  currentSuggestions(q: string, collectionName: string, exact: string) {
    if (q === '*' || q === '') {
      return of([]);
    }

    const collection: ICollectionSearchMetadata =
      this._searchMetadataRepository.get(collectionName);

    return this._suggestedResultsBy$(q, collection, exact);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSuggestionsAdv(
    q: string,
    collectionName: string,
    tags: string[],
    exact: string,
    radioValueAuthor: string,
    radioValueExact: string,
    radioValueTitle: string,
    radioValueKeyword: string
  ) {
    if ((q === '*' || q === '') && tags.length === 0) {
      return of([]);
    }

    const collections: ICollectionSearchMetadata[] =
      collectionName === 'all_collection'
        ? this._searchMetadataRepository
            .getAll()
            .filter(({ id }) => id !== URL_PARAM_NAME)
        : [this._searchMetadataRepository.get(collectionName)];

    return combineLatest(
      this._suggestedResultsByAdv$(
        q,
        collections,
        tags,
        exact,
        radioValueAuthor,
        radioValueExact,
        radioValueTitle,
        radioValueKeyword
      )
    ).pipe(
      map((responses) => responses.filter(({ results }) => results.length > 0)),
      map((responses) => responses.map(toSuggestedResultsAdv))
    );
  }

  _suggestedResultsBy$(
    q: string,
    collection: ICollectionSearchMetadata,
    exact: string
  ) {
    q = queryChanger(q, exact === 'true');

    const searchMetadata = {
      q,
      fq: [],
      exact: exact,
      rows: MAX_COLLECTION_RESULTS,
      cursor: '*',
      sort: [],
      ...collection.params,
    };

    return this._fetchDataService.fetchSuggestions$(searchMetadata).pipe(
      map((response) =>
        Object.entries(response)
          .map((response_item) => {
            const [collection, results] = response_item;
            return {
              collection: collection,
              results: results,
            };
          })
          .filter((response_item) => response_item.results.length > 0)
      ),
      map((response) =>
        response.map((response_item) => {
          const collection: ICollectionSearchMetadata =
            this._searchMetadataRepository.get(response_item.collection);
          const adapter = this._adaptersRepository.get(collection.id)
            ?.adapter as adapterType;

          return toSuggestedResults(response_item, adapter);
        })
      )
    );
  }

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

  _suggestedResultsByAdv$(
    q: string,
    collections: ICollectionSearchMetadata[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: string[],
    exact: string,
    radioValueAuthor: string,
    radioValueExact: string,
    radioValueTitle: string,
    radioValueKeyword: string
  ) {
    q = queryChangerAdv(q, exact === 'true');
    let filters: string[] = [];

    const authors: number[] = [];
    const exacts: number[] = [];
    const titles: number[] = [];
    const keywords: number[] = [];
    const allIndexes: number[] = [];

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
            '" OR doi:"' +
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
        filters.push('!doi:"' + tag.split(':', 2)[1].trim() + '"');
      }
      if (tag.startsWith('in title:')) {
        filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
        titles.push(filters.length - 1);
      }
      if (tag.startsWith('doi:')) {
        filters.push('doi:"' + tag.split(':', 2)[1].trim() + '"');
        titles.push(filters.length - 1);
      }
      if (tag.startsWith('keyword:')) {
        filters.push('keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        keywords.push(filters.length - 1);
      }
    }

    if (radioValueAuthor !== 'A') {
      let new_aut = '';
      for (const author of authors) {
        new_aut += filters[author] + ' OR ';
        allIndexes.push(author);
      }
      new_aut = new_aut.slice(0, new_aut.length - 4);
      filters.push(new_aut);
    }
    if (radioValueExact !== 'A') {
      let new_exc = '';
      for (const exactel of exacts) {
        new_exc += filters[exactel] + ' OR ';
        allIndexes.push(exactel);
      }
      new_exc = new_exc.slice(0, new_exc.length - 4);
      filters.push(new_exc);
    }
    if (radioValueTitle !== 'A') {
      let new_title = '';
      for (const exactit of titles) {
        new_title += filters[exactit] + ' OR ';
        allIndexes.push(exactit);
      }
      new_title = new_title.slice(0, new_title.length - 4);
      filters.push(new_title);
    }
    if (radioValueKeyword !== 'A') {
      let new_keyword = '';
      for (const keywordel of keywords) {
        new_keyword += filters[keywordel] + ' OR ';
        allIndexes.push(keywordel);
      }
      new_keyword = new_keyword.slice(0, new_keyword.length - 4);
      filters.push(new_keyword);
    }

    filters = filters.filter((value, index) => !allIndexes.includes(index));

    return collections.map((metadata) => {
      const searchMetadata = {
        q: q,
        fq: filters,
        exact: exact,
        rows: MAX_COLLECTION_RESULTS,
        cursor: '*',
        sort: [],
        ...metadata.params,
      };
      const adapter = this._adaptersRepository.get(metadata.id)
        ?.adapter as adapterType;
      return this._fetchDataService
        .fetchResultsAdv$(searchMetadata, metadata.facets, adapter)
        .pipe(map((results) => ({ ...results, link: metadata.id })));
    });
  }
}
