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

  currentSuggestions(q: string, collectionName: string) {
    if (q === '*' || q === '') {
      return of([]);
    }

    const collection: ICollectionSearchMetadata =
      this._searchMetadataRepository.get(collectionName);

    return this._suggestedResultsBy$(q, collection);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentSuggestionsAdv(q: string, collectionName: string, tags: string[]) {
    if ((q === '*' || q === '') && tags.length === 0) {
      return of([]);
    }

    const collections: ICollectionSearchMetadata[] =
      collectionName === 'all'
        ? this._searchMetadataRepository
            .getAll()
            .filter(({ id }) => id !== URL_PARAM_NAME)
        : [this._searchMetadataRepository.get(collectionName)];

    return combineLatest(
      this._suggestedResultsByAdv$(q, collections, tags)
    ).pipe(
      map((responses) => responses.filter(({ results }) => results.length > 0)),
      map((responses) => responses.map(toSuggestedResultsAdv))
    );
  }

  _suggestedResultsBy$(q: string, collection: ICollectionSearchMetadata) {
    q = queryChanger(q);
    const searchMetadata = {
      q,
      fq: [],
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
            this._searchMetadataRepository.get(
              response_item.collection === 'data_source'
                ? 'data-source'
                : response_item.collection
            );
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
    tags: string[]
  ) {
    q = queryChangerAdv(q);
    const filters: string[] = [];

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
        filters.push('!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!description:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"');
        filters.push('!tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"');
      }
      if (tag.startsWith('in title:')) {
        filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
      }
    }

    return collections.map((metadata) => {
      const searchMetadata = {
        q: q,
        fq: filters,
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
