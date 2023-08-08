import { Component, Input } from '@angular/core';
import {
  IColoredTag,
  ISecondaryTag,
  ITag,
  IValueWithLabel,
} from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { toArray } from '@collections/filters-serializers/utils';
import { RedirectService } from '@collections/services/redirect.service';
import { environment } from '@environment/environment';
import { COLLECTION } from '@collections/data/services/search-metadata.data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IService } from '@collections/data/services/service.model';
import { IOffer } from '@collections/data/bundles/bundle.model';

@Component({
  selector: 'ess-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  q$ = this._customRoute.q$;
  validUrl: string | null = null;
  highlightsreal: { [field: string]: string[] | undefined } = {};

  @Input() id!: string;
  @Input() date?: string;

  @Input() description!: string;

  @Input() abbreviation!: string;

  @Input() title!: string;

  @Input() offers: IOffer[] = [];

  @Input()
  set url(url: string) {
    if (url && url.trim() !== '') {
      this.validUrl = url;
      return;
    }
  }

  @Input()
  type!: IValueWithLabel;

  @Input()
  tags: ITag[] = [];

  @Input()
  coloredTags: IColoredTag[] = [];

  @Input()
  downloads?: number;

  @Input()
  views?: number;

  @Input()
  accessRight?: string;

  @Input()
  secondaryTags: ISecondaryTag[] = [];

  @Input()
  set highlights(highlights: { [field: string]: string[] | undefined }) {
    this.highlightsreal = highlights;
    return;
  }

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    public redirectService: RedirectService,
    private _http: HttpClient
  ) {}

  get$(id: number | string): Observable<IService> {
    const endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;
    return this._http.get<IService>(`${endpointUrl}/${id}`);
  }

  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: this._addFilter(filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  _addFilter(filter: string, value: string): string[] {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fqMap = this._customRoute.fqMap();
    if (toArray(fqMap[value]).includes(value)) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    return deserializeAll(
      {
        ...this._customRoute.fqMap(),
        [filter]: [...toArray(this._customRoute.fqMap()[filter]), value],
      },
      filtersConfigs
    );
  }
}
