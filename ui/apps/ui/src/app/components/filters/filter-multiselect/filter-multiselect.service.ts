import { Injectable } from '@angular/core';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import {
  ICollectionSearchMetadata,
  IFacetBucket,
  IFilterNode,
} from '@collections/repositories/types';
import { toSearchMetadata } from '../utils';
import { Observable, map } from 'rxjs';
import { paramType } from '@collections/services/custom-route.type';
import { toFilterFacet } from '@components/filters/utils';
import { FilterService } from '@components/filters/filters.service';

@Injectable()
export class FilterMultiselectService {
  constructor(
    private _filterMultiselectRepository: FilterMultiselectRepository,
    private _filterService: FilterService
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

  _fetchAllValues$(
    filter: string,
    collection: string,
    mutator?: (bucketValues: IFacetBucket[]) => IFilterNode[]
  ): Observable<IFilterNode[]> {
    const metadata = this._filterService.searchMetadataRepository.get(
      collection
    ) as ICollectionSearchMetadata;
    return this._filterService
      .fetchTreeNodes$(
        [filter],
        toSearchMetadata('*', [], metadata),
        [toFilterFacet(filter)],
        mutator
      )
      .pipe(
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
    const metadata = this._filterService.searchMetadataRepository.get(
      routerParams['collection'] as string
    );
    const q = routerParams['q'] as string;
    const fq = routerParams['fq'] as string[];

    return this._filterService
      .fetchTreeNodes$(
        [filter],
        toSearchMetadata(q, fq, metadata),
        [toFilterFacet(filter)],
        mutator
      )
      .pipe(
        map((entities) => entities.map(({ id, count }) => ({ id, count })))
      );
  }
}
