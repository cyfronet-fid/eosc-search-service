import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import {
  deserializeAll,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import { toArray } from '@collections/filters-serializers/utils';
import { IFilterConfig } from '@collections/repositories/types';

@Injectable({
  providedIn: 'root',
})
export class FilterCheckboxUtils {
  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  async removeFilter(filterName: string, value: string): Promise<void> {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fq = this._removeFilter(filterName, value, filtersConfigs);
    const fqMap = serializeAll(fq, filtersConfigs);
    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, filtersConfigs),
      },
      queryParamsHandling: 'merge',
    });
  }

  _removeFilter(
    filterName: string,
    value: string,
    filtersConfigs: IFilterConfig[]
  ) {
    const fqMap = this._customRoute.fqMap();

    fqMap[filterName] = toArray(fqMap[filterName]).filter((currentValue) => {
      if (currentValue.includes(value)) {
        return false;
      } else {
        return true;
      }
    });
    const deserialized = deserializeAll(fqMap, filtersConfigs);

    return deserialized;
  }

  async addFilter(filterName: string, value: string): Promise<void> {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fq = this._addFilter(filterName, value, filtersConfigs);
    const fqMap = serializeAll(fq, filtersConfigs);

    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, filtersConfigs),
      },
      queryParamsHandling: 'merge',
    });
  }

  _addFilter(
    filterName: string,
    value: string,
    filtersConfigs: IFilterConfig[]
  ) {
    const fqMap = this._customRoute.fqMap();
    if (
      !!fqMap[filterName] &&
      (fqMap[filterName] as string[]).includes(value)
    ) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    fqMap[filterName] = fqMap[filterName]
      ? ([...fqMap[filterName], value] as string[])
      : [value];
    return deserializeAll(fqMap, filtersConfigs);
  }
}
