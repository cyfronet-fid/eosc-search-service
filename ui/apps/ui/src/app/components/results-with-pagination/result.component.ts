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
  template: `
    <div
      id="container"
      [ngClass]="type.value === 'bundle' ? 'bundle_container' : 'nobundle'"
    >
      <ess-colored-tags
        [type]="type"
        [tags]="coloredTags"
        [q]="q$ | async"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      ></ess-colored-tags>

      <ess-url-title
        [title]="title"
        [highlight]="highlightsreal['title'] ?? []"
        [url]="redirectService.internalUrl(validUrl, id, type.value)"
      >
      </ess-url-title>

      <div class="usage">
        <span
          *ngIf="accessRight !== undefined"
          [ngClass]="{
            statistic: true,
            'open-access': accessRight?.toLowerCase() === 'open access',
            'other-access': accessRight?.toLowerCase() !== 'open access'
          }"
          ><img
            [src]="
              accessRight?.toLowerCase() === 'open access'
                ? '/assets/usage-access.svg'
                : '/assets/restricted access.svg'
            "
          />
          <ng-container i18n>{{ accessRight }}</ng-container></span
        >
        <span
          *ngIf="date !== null && type.value !== 'bundle'"
          class="statistic text-muted"
          ><img src="/assets/usage-date.svg" />
          <ng-container i18n>{{ date }}</ng-container></span
        >
        <span
          *ngIf="type !== null && type.value !== 'bundle'"
          class="statistic text-muted"
          ><img src="/assets/usage-type.svg" />
          <ng-container i18n>Type: {{ type.label }}</ng-container></span
        >
        <span *ngIf="downloads !== undefined" class="statistic text-muted"
          ><img src="/assets/usage-downloads.svg" />
          <ng-container i18n>{{ downloads }} Downloads</ng-container></span
        >
        <span *ngIf="views !== undefined" class="statistic text-muted"
          ><img src="/assets/usage-views.svg" />
          <ng-container i18n>{{ views }} Views</ng-container></span
        >
      </div>
      <ess-tags
        [tags]="tags"
        [highlights]="highlightsreal"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      >
      </ess-tags>
      <ess-secondary-tags
        [highlights]="highlightsreal"
        [tags]="secondaryTags"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      >
      </ess-secondary-tags>
      <ess-description
        [description]="description"
        [highlights]="highlightsreal['description'] ?? []"
      ></ess-description>
      <div class="bundle-box" *ngIf="type.value === 'bundle'">
        <div
          *ngFor="let offer of offers"
          class="bundle-item align-items-stretch"
        >
          <div class="card">
            <div class="card-body d-flex flex-row">
              <div class="bundle-offer-pic p-2">
                <img src="assets/bundle_service.svg" />
              </div>
              <div class="bundle-offer-desc p-2">
                <h4 class="card-title">
                  {{ offer.service?.title ?? 'Unknown Service' }}
                </h4>
                <div class="provided-by">
                  Provided by {{ offer.service?.resource_organisation }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .usage > .statistic {
        font-size: 11px;
        margin-right: 15px;
        display: inline-block;
        line-height: 17px;
        height: 17px;
        vertical-align: middle;
      }

      .usage > .statistic img {
        margin-right: 5px;
        max-height: 17px;
        width: auto;
        vertical-align: middle;
      }

      .bundle-box {
        margin-top: 24px;
      }

      /* z serwisu */
      .bundle-box .bundle-item {
        border-left: 4px solid #84caff;
      }

      .bundle-box .bundle-item:first-child .card {
        border-top: 1px solid #dfe2e4;
      }

      .bundle-box .bundle-item .card {
        background: none;
        border-radius: 0;
        border: none;
        border-bottom: 2px dashed #dfe2e4;
      }

      .bundle-box .bundle-item:nth-last-child .card {
        background: none;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #dfe2e4 !important;
      }

      .card-title {
        margin-bottom: 0.25rem;
        font-size: 12px;
        padding: 0;
        font-weight: 600;
        line-height: 1.2;
      }

      .provided-by {
        margin-bottom: 0.25rem;
        font-size: 12px;
        padding: 0;
        line-height: 1.2;
      }

      .bundle_container {
        padding: 20px 48px 48px 25px !important;
      }
    `,
  ],
})
export class ResultComponent {
  q$ = this._customRoute.q$;
  validUrl: string | null = null;
  highlightsreal: { [field: string]: string[] | undefined } = {};

  @Input() id!: string;
  @Input() date?: string;

  @Input()
  description!: string;

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
