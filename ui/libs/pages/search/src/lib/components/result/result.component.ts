import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

const MAX_TITLE_WORDS_LENGTH = 12;
const MAX_DESCRIPTION_WORDS_LENGTH = 64;

interface ITag {
  type: string;
  value: string;
}

@Component({
  selector: 'ess-result',
  template: `
    <div id="container">
      <h6>
        <b>{{ shortTitle }}</b>
      </h6>
      <p id="tags">
        <span class="tag"
          ><b
            ><i>
              Type:
              <a href="javascript:void(0)" (click)="queryParams = { type }">{{
                type
              }}</a
              >,
            </i></b
          ></span
        >
        <ng-container *ngFor="let tag of tags">
          <span class="tag"
            ><i
              >{{ tag.type }}:
              <a
                href="javascript:void(0)"
                (click)="queryParams = toParam(tag)"
                >{{ tag.value }}</a
              ></i
            >,</span
          >
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
        cursor: pointer;
        margin-bottom: 20px;
      }
      h6 {
        margin-bottom: 4px;
      }
      h6:hover {
        color: rgba(57, 135, 190);
      }
      #tags {
        margin-bottom: 4px;
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

  @Input()
  set title(title: string) {
    const words = title.split(' ');
    const isTooLong = words.length > MAX_TITLE_WORDS_LENGTH;
    if (!isTooLong) {
      this.shortTitle = title;
      return;
    }

    this.shortTitle =
      words.slice(0, MAX_TITLE_WORDS_LENGTH).join(' ') + ' [...]';
  }

  @Input()
  set description(description: string) {
    const words = description.split(' ');
    const isTooLong = words.length > MAX_DESCRIPTION_WORDS_LENGTH;
    if (!isTooLong) {
      this.shortDescription = description;
      return;
    }

    this.shortDescription =
      words.slice(0, MAX_DESCRIPTION_WORDS_LENGTH).join(' ') + ' [...]';
  }

  @Input()
  type: 'Publication' | 'Training' | 'Service' | 'Unknown' | string = 'Unknown';

  @Input()
  tags: ITag[] = [];

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  set queryParams(queryParams: { [param: string]: any }) {
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  toParam = (tag: ITag) => ({ [tag.type]: tag.value });
}
