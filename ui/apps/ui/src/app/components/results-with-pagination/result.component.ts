import { Component, Input } from '@angular/core';
import {
  IColoredTag,
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
      <div *ngIf="date" class="date-box">
        {{ date }}
      </div>

      <ess-url-title
        [title]="title"
        [url]="redirectService.internalUrl(validUrl, id, type.label)"
      >
      </ess-url-title>

      <ess-colored-tags
        [type]="type"
        [tags]="coloredTags"
        [q]="q$ | async"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      ></ess-colored-tags>
      <ess-tags
        [tags]="tags"
        (activeFilter)="setActiveFilter($event.filter, $event.value)"
      >
      </ess-tags>

      <div class="usage">
        <span *ngIf="downloads !== null" class="statistic text-muted"
          ><img src="/assets/usage-downloads.svg" />
          <ng-container i18n>{{ downloads }} Downloads</ng-container></span
        >
        <span *ngIf="views !== null" class="statistic text-muted"
          ><img src="/assets/usage-views.svg" />
          <ng-container i18n>{{ views }} Views</ng-container></span
        >
      </div>

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
        margin-right: 30px;
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
  downloads: number | null = null;

  @Input()
  views: number | null = null;

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
