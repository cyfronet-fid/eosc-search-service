import { Component, Input } from '@angular/core';
import {
  IColoredTag,
  ISecondaryTag,
  ITag,
  IValueWithLabel,
} from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { truncate } from 'lodash-es';
import { Router } from '@angular/router';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { toArray } from '@collections/filters-serializers/utils';
import { RedirectService } from '@collections/services/redirect.service';

const MAX_CHARS_LENGTH = 256;

@Component({
  selector: 'ess-result',
  template: `
    <div id="container">
      <ess-colored-tags
        [type]="type"
        [tags]="coloredTags"
        [q]="q$ | async"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      ></ess-colored-tags>

      <ess-url-title
        [title]="title"
        [url]="redirectService.internalUrl(validUrl, id, type.label)"
      >
      </ess-url-title>

      <div class="usage">
        <span class="statistic open-access"
          ><img src="/assets/usage-access.svg" />
          <ng-container i18n>{{ accessRight }}</ng-container></span
        >
        <span *ngIf="date !== null" class="statistic text-muted"
          ><img src="/assets/usage-date.svg" />
          <ng-container i18n>{{ date }}</ng-container></span
        >
        <span *ngIf="type !== null" class="statistic text-muted"
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
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      >
      </ess-tags>

      <ess-secondary-tags
        [tags]="secondaryTags"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      >
      </ess-secondary-tags>

      <p class="description">
        <span>
          {{ showFull ? description : truncate(description) }}
        </span>
        <a
          *ngIf="displayShowMoreBtn()"
          href="javascript:void(0)"
          class="btn-show-more"
          (click)="showFull = !showFull"
          >Show {{ showFull ? 'less' : 'more' }}
        </a>
      </p>
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
    `,
  ],
})
export class ResultComponent {
  q$ = this._customRoute.q$;

  shortTitle = '';
  validUrl: string | null = null;
  showFull = false;

  @Input() id!: string;
  @Input() date?: string;

  @Input()
  description!: string;

  @Input()
  title!: string;

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

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    public redirectService: RedirectService
  ) {}

  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: this._addFilter(filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  displayShowMoreBtn() {
    return this.description.length >= MAX_CHARS_LENGTH;
  }

  truncate(description: string) {
    return truncate(description, { length: MAX_CHARS_LENGTH });
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
