import { Inject, Injectable } from '@angular/core';
import { FiltersRepository } from './filters.repository';
import { HttpClient } from '@angular/common/http';
import { CommonSettings, ESS_SETTINGS } from '@eosc-search-service/common';
import { forkJoin, map, Observable, of, tap } from 'rxjs';
import { getEntity, updateEntities } from '@ngneat/elf-entities';
import { assertNotNull, HashMap, IHasId } from '@eosc-search-service/types';
import {
  ICollectionSearchMetadata,
  ISolrQueryParams,
  toSolrQueryParams,
} from '../results';
import { ISet } from '../../sets';
import {addFacetsToFilter, IFilterEntry, mapFacetToTreeNodes} from './filters.model';
import {
  FILTERS_FETCH_MORE_LIMIT,
  INITIAL_FILTER_OPTION_COUNT,
  ISearchResults,
} from '../common';
import { arrayAdd } from '@ngneat/elf/lib/props-array-factory';

@Injectable({ providedIn: 'root' })
export class FiltersService {
  readonly url: string;
  constructor(
    protected _repository: FiltersRepository,
    protected http: HttpClient,
    @Inject(ESS_SETTINGS) protected settings: CommonSettings
  ) {
    this.url = `/${this.settings.backendApiPath}/${this.settings.search.apiPath}`;
  }

  get$() {}

  loadNext$() {}

  search$(query: string) {}

  showMore$(
    id: string,
    queryParams: HashMap<unknown>,
    activeSet: ISet
  ): Observable<unknown> {
    this._repository.store.update(
      updateEntities(id, (state) => {
        let data = state.data;
        const newShowMore = !state.showMore
        if (!newShowMore) {
          data = data.slice(0, INITIAL_FILTER_OPTION_COUNT);
        }
        return { ...state, showMore: newShowMore, data }
      })
    );

    return this.searchFilters$(id, '*', queryParams, activeSet, true);
  }

  searchFilters$(
    id: string,
    query: string,
    queryParams: HashMap<unknown>,
    activeSet: ISet,
    fetchNext: boolean = false
  ) {
    const params = toSolrQueryParams(queryParams);

    const filter = this._repository.store.query(getEntity(id));
    assertNotNull(filter);
    if (!fetchNext) {
      this._repository.store.update(
        updateEntities(id, (f) => {
          const cursors = { ...f.cursors };
          Object.entries(cursors).forEach(([key, val]) => {
            cursors[key] = { offset: 0, moreAvailable: true };
          });
          return {
            ...f,
            cursors,
          };
        })
      );
    }
    return forkJoin<IFilterEntry[][]>(
      activeSet.collections
        .filter((collection) => filter.cursors[collection.type]?.moreAvailable)
        .map((metadata) => this.fetchMoreForSingle$(id, metadata, params, query, fetchNext))
    );
  }

  fetchMoreForSingle$<T extends IHasId>(
    id: string,
    metadata: ICollectionSearchMetadata<T>,
    params: ISolrQueryParams,
    query: string,
    fetchNext: boolean = false
  ): Observable<IFilterEntry[]> {
    const _params = { ...params, ...metadata.params, rows: 0};
    const filter = this._repository.store.query(getEntity(id));
    assertNotNull(filter);
    return this.http
      .post<ISearchResults<T>>(
        this.url,
        {
          facets: {
            [id]: {
              contains: query,
              field: id,
              type: 'terms',
              offset: filter.cursors[metadata.type].offset,
              limit: FILTERS_FETCH_MORE_LIMIT,
            },
          },
        },
        { params: _params }
      )
      .pipe(
        tap((data) => {
          this._repository.store.update(
            updateEntities(id, (f) => {
              const out = {
                ...f,
                cursors: {
                  ...f.cursors,
                  [metadata.type]: {
                    ...f.cursors[metadata.type],
                    offset:
                      f.cursors[metadata.type].offset + FILTERS_FETCH_MORE_LIMIT,
                    moreAvailable:
                      data.facets[id].buckets.length === FILTERS_FETCH_MORE_LIMIT,
                  },
                },
                data: (fetchNext ? [...f.data, ...mapFacetToTreeNodes(data.facets[id], id)] : mapFacetToTreeNodes(data.facets[id], id))
              }
              return out;
            })
          );
        }),
        map(() => [])
      );
  }
}
