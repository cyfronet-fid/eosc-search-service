import { Injectable } from '@angular/core';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { combineLatest, map, of } from 'rxjs';
import { ICollectionSearchMetadata } from '@collections/repositories/types';
import { toSuggestedResults } from './utils';
import { URL_PARAM_NAME } from '@collections/data/all/nav-config.data';
import { queryChanger } from '@collections/filters-serializers/utils';
import { allCollectionsAdapter } from '@collections/data/all/adapter.data';

const MAX_COLLECTION_RESULTS = 3; // TODO: Move to env file

@Injectable({
  providedIn: 'root',
})
export class SearchInputService {
  constructor(
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
      return this._fetchDataService
        .fetchResults$(
          searchMetadata,
          metadata.facets,
          allCollectionsAdapter.adapter
        )
        .pipe(map((results) => ({ ...results, link: metadata.id })));
    });
  }
}
