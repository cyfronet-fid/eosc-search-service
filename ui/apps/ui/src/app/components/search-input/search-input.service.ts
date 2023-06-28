import { Injectable } from '@angular/core';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { combineLatest, map, of } from 'rxjs';
import {
  ICollectionSearchMetadata,
  adapterType,
} from '@collections/repositories/types';
import { toSuggestedResults } from './utils';
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

    const collections: ICollectionSearchMetadata[] =
      collectionName === 'all'
        ? this._searchMetadataRepository
            .getAll()
            .filter(({ id }) => id !== URL_PARAM_NAME)
        : [this._searchMetadataRepository.get(collectionName)];

    return combineLatest(this._suggestedResultsBy$(q, collections)).pipe(
      map((responses) => responses.filter(({ results }) => results.length > 0)),
      map((responses) => responses.map(toSuggestedResults))
    );
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
      map((responses) => responses.map(toSuggestedResults))
    );
  }

  _suggestedResultsBy$(q: string, collections: ICollectionSearchMetadata[]) {
    q = queryChanger(q);
    return collections.map((metadata) => {
      const searchMetadata = {
        q,
        fq: [],
        rows: MAX_COLLECTION_RESULTS,
        cursor: '*',
        sort: [],
        ...metadata.params,
      };
      const adapter = this._adaptersRepository.get(metadata.id)
        ?.adapter as adapterType;
      return this._fetchDataService
        .fetchResults$(searchMetadata, metadata.facets, adapter)
        .pipe(map((results) => ({ ...results, link: metadata.id })));
    });
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
        filters.push('author_names_tg:"' + tag.split(':', 2)[1].trim() + '"');
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
