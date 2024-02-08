import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';

@Injectable({
  providedIn: 'root',
})
export class FilterRadioUtils {
  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  async replaceFilter(filter: string, status: string): Promise<void> {
    const fqMap = this._customRoute.fqMap();
    fqMap[filter] = status;
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;

    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, filtersConfigs),
      },
      queryParamsHandling: 'merge',
    });
  }
}
