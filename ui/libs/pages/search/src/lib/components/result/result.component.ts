import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shortText } from './utils';
import {addFq} from '@eosc-search-service/search';
import {ITag} from "../../../../../../search/src/lib/result.model";

const MAX_TITLE_WORDS_LENGTH = 12;
const MAX_DESCRIPTION_WORDS_LENGTH = 64;

@Component({
  selector: 'ess-result',
  template: `
    <div id="container">
      <h6>
        <a *ngIf="validUrl; else onlyTitleRef" [href]="validUrl" target="_blank">
          <b>{{ shortTitle }}</b>
        </a>
        <ng-template #onlyTitleRef><b>{{ shortTitle }}</b></ng-template>
      </h6>
      <p id="tags">
        <span class="tag"
        ><b
        ><i>
              Type:
              <a [routerLink]="typeUrlPath" queryParamsHandling="merge">{{
                type
                }}</a
              >,
            </i></b
        ></span
        >
        <ng-container *ngFor="let tag of tags">
          <span class="tag"
          ><i>{{ tag.label }}: </i></span
          >
          <ng-container *ngIf="isArray(tag.value)">
            <ng-container *ngFor="let singleValue of $any(tag.value)">
              <span class="tag"
              ><i
              ><a
                href="javascript:void(0)"
                (click)="addFilter(tag.originalField, singleValue)"
              >{{ singleValue }}</a
              >,&nbsp;</i
              ></span
              >
            </ng-container>
          </ng-container>
          <ng-container *ngIf="!isArray(tag.value)">
            <span class="tag"
            ><i>
                <a
                  href="javascript:void(0)"
                  (click)="addFilter(tag.originalField, $any(tag.value))"
                >{{ tag.value }}</a
                > </i
            >,&nbsp;</span
            >
          </ng-container>
        </ng-container>
      </p>
      <p class="description">
        <i>
          {{ shortDescription }}
        </i>
      </p>
    </div>
  `,
  styles: [
    `
      #container {
        /*cursor: pointer;*/
        margin-bottom: 20px;
      }
      h6 {
        margin-bottom: 0;
      }
      #tags {
        margin-bottom: 0;
      }
      .tag {
        font-size: 12px;
      }
      .tag a {
        color: rgba(0, 0, 0, 0.6);
      }
      .tag a:hover {
        color: rgba(57, 135, 190);
      }
      #description {
        font-size: 12px;
      }

    `,
  ],
})
export class ResultComponent {
  shortDescription = '';
  shortTitle = '';
  validUrl: string | null = null;

  @Input()
  set title(title: string) {
    this.shortTitle = shortText(title, MAX_TITLE_WORDS_LENGTH);
  }

  @Input()
  set description(description: string) {
    this.shortDescription = shortText(
      description,
      MAX_DESCRIPTION_WORDS_LENGTH
    );
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

  constructor(private _router: Router, private _route: ActivatedRoute) {}
  isArray = (tagValue: string | string[]) => Array.isArray(tagValue);
  addFilter = async (filterName: string, value: string) => {
    const fq = addFq(this._router.url, filterName, value);
    await this._router.navigate([], {
      queryParams: { fq },
      queryParamsHandling: 'merge',
    });
  };
}