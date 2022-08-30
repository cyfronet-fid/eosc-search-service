import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { FetchDataService } from '@collections/services/fetch-data.service';
import {
  ICollectionSearchMetadata,
  IFacetParam,
  ISolrCollectionParams,
  ISolrQueryParams,
} from '@collections/repositories/types';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { facetToTreeNodes } from '../utils';
import { map, tap } from 'rxjs';
import { paramType } from '@collections/services/custom-router.type';
import { CustomRouter } from '@collections/services/custom.router';
import {
  toFilterFacet,
  toSearchMetadata,
} from '@components/filters/filter-multiselect/utils';

const DEFAULT_RESULTS_SIZE = 10;
const RECORD_HEIGHT = 29; // PX
const LOAD_NEXT_CHUNK_INDEX = 90;

@Injectable()
export class FilterMultiselectService {
  constructor(
    private _customRouter: CustomRouter,
    private _filterMultiselectRepository: FilterMultiselectRepository,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository
  ) {}

  latestChunk = 0;
  filter = '';

  initNonActiveEntitiesChunk$ =
    this._filterMultiselectRepository.initNonActiveEntitiesChunk$;
  isLoading$ = this._filterMultiselectRepository.isLoading$;
  activeEntities$ = this._filterMultiselectRepository.activeEntities$;
  chunkedNonActiveEntities$ =
    this._filterMultiselectRepository.chunkedNonActiveEntities$;
  hasShowMore$ = this._filterMultiselectRepository.nonActiveEntities$.pipe(
    map(({ length }) => length > DEFAULT_RESULTS_SIZE)
  );
  limitedNonActiveEntities$ =
    this._filterMultiselectRepository.nonActiveEntities$.pipe(
      map((entities) => {
        const maxSize =
          DEFAULT_RESULTS_SIZE -
          this._filterMultiselectRepository.activeEntitiesIds().length;
        if (maxSize <= 0) {
          return [];
        }
        return entities.slice(0, maxSize);
      })
    );

  setActiveIds = (activeIds: string[]) =>
    this._filterMultiselectRepository.setActiveIds(activeIds);
  setQuery = (query: string) =>
    this._filterMultiselectRepository.setQuery(query);

  onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    const currentPosition = target.scrollTop;
    const currentIndex = Math.ceil(currentPosition / RECORD_HEIGHT);
    const currentChunk = Math.floor(currentIndex / LOAD_NEXT_CHUNK_INDEX);
    if (currentChunk > this.latestChunk) {
      this.latestChunk = currentChunk;
      this._filterMultiselectRepository.loadNextNonActiveChunk();
    }
  };
  _loadAllAvailableValues$(collection: string) {
    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    return this._fetchTreeNodes$(
      toSearchMetadata('*', [], metadata),
      toFilterFacet(this.filter, metadata.facets)
    );
  }
  _updateCounts$(routerParams: { [param: string]: paramType }) {
    const metadata = this._searchMetadataRepository.get(
      routerParams['collection'] as string
    );
    const q = routerParams['q'] as string;
    const fq = routerParams['fq'] as string[];

    this._filterMultiselectRepository.resetAllEntitiesCounts();
    this.latestChunk = 0;

    return this._fetchTreeNodes$(
      toSearchMetadata(q, fq, metadata),
      toFilterFacet(this.filter, metadata.facets)
    );
  }
  _fetchTreeNodes$(
    params: ISolrCollectionParams & ISolrQueryParams,
    facets: { [facet: string]: IFacetParam }
  ) {
    this._filterMultiselectRepository.setLoading(true);
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(params, facets)
      .pipe(
        map((facets) => facetToTreeNodes(facets[this.filter], this.filter)),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map((nodes) => nodes.map(({ isSelected, ...other }) => other)),
        tap((nodes) => this._filterMultiselectRepository.upsertEntities(nodes)),
        tap(() => this._filterMultiselectRepository.setLoading(false))
      );
  }
}
