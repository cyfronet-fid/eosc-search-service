import { Component, Input } from '@angular/core';
import { IColoredTag, ITag } from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { truncate } from 'lodash-es';
import { Router } from '@angular/router';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { toArray } from '@collections/filters-serializers/utils';
import { RedirectService } from '@collections/services/redirect.service';

const MAX_TITLE_WORDS_LENGTH = 12;
const MAX_CHARS_LENGTH = 256;
const shortText = (text: string, maxWords: number): string => {
  const words = text?.split(' ');
  const isTooLong = words?.length > maxWords;
  return isTooLong ? words.slice(0, maxWords).join(' ') + ' [...]' : text;
};

@Component({
  selector: 'ess-result',
  template: `
    <div id="container">
      <div *ngIf="date" class="date-box">
        {{ date }}
      </div>

      <h6>
        <a
          *ngIf="validUrl; else onlyTitleRef"
          [attr.href]="redirectService.internalUrl(validUrl, id, type)"
          target="_blank"
        >
          <b>{{ shortTitle }}</b>
        </a>
        <ng-template #onlyTitleRef
          ><b>{{ shortTitle }}</b></ng-template
        >
      </h6>

      <div class="tags-box">
        <a [routerLink]="'/search/' + type" queryParamsHandling="merge">
          {{ type }}
        </a>

        <ng-container *ngFor="let tag of coloredTags">
          <a
            *ngFor="let value of tag.value"
            [attr.class]="tag.colorClassName"
            href="javascript:void(0)"
            (click)="setActiveFilter(tag.filter, $any(value))"
          >
            {{ value }}
          </a>
        </ng-container>
      </div>

      <div id="tags">
        <ng-container *ngFor="let tag of tags">
          <div class="tag-row" *ngIf="tag.value.length > 0">
            <span class="tag tag-title">{{ tag.label }}: </span>
            <ng-container *ngFor="let singleValue of $any(tag.value)">
              <span class="tag"
                ><a
                  href="javascript:void(0)"
                  (click)="setActiveFilter(tag.filter, singleValue)"
                  >{{ singleValue }}</a
                >&nbsp;&nbsp;</span
              >
            </ng-container>
          </div>
        </ng-container>
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
    `,
  ],
})
export class ResultComponent {
  shortTitle = '';
  validUrl: string | null = null;
  showFull = false;

  @Input() id!: string;
  @Input() date?: string;

  @Input()
  description!: string;

  @Input()
  set title(title: string) {
    this.shortTitle = shortText(title, MAX_TITLE_WORDS_LENGTH);
  }

  @Input()
  set url(url: string) {
    if (url && url.trim() !== '') {
      this.validUrl = url;
      return;
    }
  }

  @Input()
  type!: string;

  @Input()
  tags: ITag[] = [];

  @Input()
  coloredTags: IColoredTag[] = [];

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
