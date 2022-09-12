import { Component, Input } from '@angular/core';
import { ITag } from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { isArray } from 'lodash-es';
import { Router } from '@angular/router';
import { addFq } from '@collections/services/custom-route.utils';

const MAX_TITLE_WORDS_LENGTH = 12;
const MAX_DESCRIPTION_WORDS_LENGTH = 64;
const shortText = (text: string, maxWords: number): string => {
  const words = text?.split(' ');
  const isTooLong = words?.length > maxWords;
  return isTooLong ? words.slice(0, maxWords).join(' ') + ' [...]' : text;
};

@Component({
  selector: 'ess-result',
  template: `
    <div id="container">
      <div class="date-box">
        {{ date }}
      </div>

      <h6>
        <a
          *ngIf="validUrl; else onlyTitleRef"
          [href]="validUrl"
          target="_blank"
        >
          <b>{{ shortTitle }}</b>
        </a>
        <ng-template #onlyTitleRef
          ><b>{{ shortTitle }}</b></ng-template
        >
      </h6>

      <div class="tags-box">
        <a [routerLink]="typeUrlPath" queryParamsHandling="merge"
          >{{ type }}
        </a>

        <a class="access-tag"> Access Type </a>

        <a class="licence-tag"> Licence </a>

        <a class="language-tag"> Language </a>
      </div>

      <div id="tags">
        <ng-container *ngFor="let tag of tags">
          <div class="tag-row">
            <span class="tag tag-title"
              ><b>{{ tag.label }}: </b></span
            >
            <ng-container *ngIf="isArray(tag.value)">
              <ng-container *ngFor="let singleValue of $any(tag.value)">
                <span class="tag"
                  ><a
                    href="javascript:void(0)"
                    (click)="setActiveFilter(tag.filter, singleValue)"
                    >{{ singleValue }}</a
                  >,&nbsp;</span
                >
              </ng-container>
            </ng-container>
            <ng-container *ngIf="!isArray(tag.value)">
              <span class="tag">
                <a
                  href="javascript:void(0)"
                  (click)="setActiveFilter(tag.filter, $any(tag.value))"
                  >{{ tag.value }}</a
                >
                ,&nbsp;</span
              >
            </ng-container>
          </div>
        </ng-container>
      </div>
      <p class="description">
        <i [class.truncate]="toTruncate(description) && !showFull">
          {{ description }}
        </i>
        <ng-container *ngIf="toTruncate(description)">
          <a
            href="javascript:void(0)"
            class="btn-show-more"
            (click)="showFull = !showFull"
            >Show {{ showFull ? 'less' : 'more' }}
          </a>
        </ng-container>
      </p>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .description .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    `,
  ],
})
export class ResultComponent {
  shortTitle = '';
  validUrl: string | null = null;
  showFull = false;

  @Input() date = '16 April 2021';

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
  typeUrlPath!: string;

  @Input()
  tags: ITag[] = [];

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  isArray = isArray;
  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: addFq(this._customRoute.fqMap(), filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  toTruncate(description: string) {
    return description.split(' ').length > MAX_DESCRIPTION_WORDS_LENGTH;
  }
}
