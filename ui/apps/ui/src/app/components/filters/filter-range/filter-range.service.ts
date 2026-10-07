import { Injectable } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import {
  ICollectionSearchMetadata,
  ISolrCollectionParams,
  ISolrQueryParams,
  IStatFacetParam,
} from '@collections/repositories/types';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { toSearchMetadata } from '@components/filters/utils';
import { Observable, map, shareReplay } from 'rxjs';
import { DEFAULT_MAX_DURATION } from '@components/filters/filter-range/utils';

@Injectable({
  providedIn: 'root',
})
export class FilterRangeService {
  private _maxDurationCache = new Map<string, Observable<number>>();

  constructor(
    private _customRoute: CustomRoute,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _fetchDataService: FetchDataService
  ) {}

  _fetchMaxDuration() {
    const collection = this._customRoute.params()['collection'] as string;
    const exact = this._customRoute.params()['exact'] as string;
    const cacheKey = `${collection}_${exact}`;

    const cached$ = this._maxDurationCache.get(cacheKey);
    if (cached$) {
      return cached$;
    }

    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;

    const searchMetadata: ISolrCollectionParams & ISolrQueryParams =
      toSearchMetadata('*', exact, [], metadata);

    const facetParams = {
      max_duration: {
        expression: 'max(duration)',
      } as IStatFacetParam,
    };

    const request$ = this._fetchDataService
      .fetchFacets$(searchMetadata, [facetParams])
      .pipe(
        map(
          (facetParams) =>
            (facetParams['max_duration'] as number) ?? DEFAULT_MAX_DURATION
        ),
        shareReplay({ bufferSize: 1, refCount: true })
      );

    this._maxDurationCache.set(cacheKey, request$);
    return request$;
  }
}
