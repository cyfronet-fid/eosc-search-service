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
import { map } from 'rxjs';
import { DEFAULT_MAX_DURATION } from '@components/filters/filter-range/utils';

@Injectable()
export class FilterRangeService {
  constructor(
    private _customRoute: CustomRoute,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _fetchDataService: FetchDataService
  ) {}

  _fetchMaxDuration() {
    const metadata = this._searchMetadataRepository.get(
      this._customRoute.params()['collection'] as string
    ) as ICollectionSearchMetadata;

    const exact = this._customRoute.params()['exact'] as string;
    const scope = this._customRoute.params()['scope'] as string;

    const searchMetadata: ISolrCollectionParams & ISolrQueryParams =
      toSearchMetadata('*', scope, exact, [], metadata);

    const facetParams = {
      max_duration: {
        expression: 'max(duration)',
      } as IStatFacetParam,
    };

    return this._fetchDataService
      .fetchFacets$(searchMetadata, [facetParams])
      .pipe(
        map(
          (facetParams) =>
            (facetParams['max_duration'] as number) ?? DEFAULT_MAX_DURATION
        )
      );
  }
}
