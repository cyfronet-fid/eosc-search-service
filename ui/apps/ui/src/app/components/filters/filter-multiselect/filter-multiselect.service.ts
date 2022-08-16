import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { FetchDataService } from '../../../collections/services/fetch-data.service';
import {
  ICollectionSearchMetadata,
  IFacetParam,
  ISolrCollectionParams,
} from '../../../collections/repositories/types';
import { SearchMetadataRepository } from '../../../collections/repositories/search-metadata.repository';
import { facetToTreeNodes } from '../utils';
import { map, tap } from 'rxjs';
import { paramType } from '../../../pages/search-page/custom-router.type';
import { CustomRouter } from '../../../pages/search-page/custom.router';

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

  onScroll = (event: Event) => {
    const target = event.target as any;
    const currentPosition = target.scrollTop;
    const currentIndex = Math.ceil(currentPosition / RECORD_HEIGHT);
    const currentChunk = Math.floor(currentIndex / LOAD_NEXT_CHUNK_INDEX);
    if (currentChunk > this.latestChunk) {
      this.latestChunk = currentChunk;
      this._filterMultiselectRepository.loadNextNonActiveChunk();
    }
  };

  setActiveIds(activeIds: string[]) {
    this._filterMultiselectRepository.resetAllActiveEntities();
    this._filterMultiselectRepository.setActiveIds(
      ...activeIds.map((id) => ({ id }))
    );
  }

  _loadAllAvailableValues$(collection: string) {
    this._filterMultiselectRepository.setLoading(true);

    // prepare context
    const metadata = this._searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    const facet = this._toFilterFacet(this.filter, metadata.facets);
    const searchMetadata = this._toSearchMetadata('*', [], metadata);

    // load data
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(searchMetadata, facet)
      .pipe(
        map((facets) => facetToTreeNodes(facets[this.filter], this.filter)),
        tap((nodes) => this._filterMultiselectRepository.upsertEntities(nodes)),
        tap(() => this._filterMultiselectRepository.setLoading(false))
      );
  }
  _updateCounts$(routerParams: { [param: string]: paramType }) {
    this._filterMultiselectRepository.setLoading(true);

    // prepare context
    const metadata = this._searchMetadataRepository.get(
      routerParams['collection'] as string
    ) as ICollectionSearchMetadata;
    const facet = this._toFilterFacet(this.filter, metadata.facets);
    const q = routerParams['q'] as string;
    const fq = routerParams['fq'] as string[];
    const searchMetadata = this._toSearchMetadata(q, fq, metadata);

    // Reset current state of entities
    this._filterMultiselectRepository.resetAllEntitiesCounts();
    this.latestChunk = 0;

    // load data & store in repository
    return this._fetchDataService
      .fetchFacets$<unknown & { id: string }>(searchMetadata, facet)
      .pipe(
        map((facets) => facetToTreeNodes(facets[this.filter], this.filter)),
        map((nodes) =>
          nodes.map(({ id, count }) => ({
            id,
            count,
          }))
        ),
        tap((nodes) => this._filterMultiselectRepository.upsertEntities(nodes)),
        tap(() => this._filterMultiselectRepository.setLoading(false))
      );
  }

  _toSearchMetadata(
    q: string,
    fq: string[],
    metadata: ICollectionSearchMetadata
  ) {
    return {
      q: metadata.queryMutator(q),
      fq,
      cursor: '*',
      rows: 0,
      sort: [],
      ...metadata.params,
    };
  }
  _toFilterFacet(filter: string, facets: { [facet: string]: IFacetParam }) {
    return {
      [filter]: {
        ...facets[filter],
        limit: -1,
      },
    };
  }
}
