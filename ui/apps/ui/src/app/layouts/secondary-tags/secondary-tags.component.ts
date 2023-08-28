import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { ISecondaryTag } from '@collections/repositories/types';
import { combineHighlightsWith } from './utils';

@Component({
  selector: 'ess-secondary-tags',
  template: `
    <div class="usage secondary-tags">
      <ng-container *ngFor="let tag of parsedTags; trackBy: identityTagTrack">
        <ng-container [ngSwitch]="tag.type">
          <ng-container *ngSwitchCase="'url'">
            <span *ngIf="tag.values.length > 0" class="statistic text-muted"
              ><img [src]="tag.iconPath" alt="" />&nbsp;
              <ng-container *ngFor="let keyword of tag.values">
                <a
                  href="javascript:void(0)"
                  (click)="setActiveFilter($any(tag.filter), keyword.value)"
                  [innerHTML]="keyword.label"
                ></a
                >&nbsp;&nbsp;&nbsp;
              </ng-container>
            </span>
          </ng-container>

          <ng-container *ngSwitchCase="'info'">
            <span *ngIf="tag.values.length > 0" class="statistic text-muted"
              ><img [src]="tag.iconPath" alt="" />
              <ng-container i18n *ngFor="let keyword of tag.values"
                >{{ keyword }}&nbsp;&nbsp;</ng-container
              ></span
            >
          </ng-container>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .usage > .statistic {
        font-size: 11px;
        display: block;
        overflow: hidden;
        margin-right: 15px;
        line-height: 1.7;
      }

      .statistic > img {
        display: inline;
        float: left;
        margin-right: 10px;
        margin-top: 5px;
      }

      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 3px;
      }
    `,
  ],
})
export class SecondaryTagsComponent implements OnChanges {
  parsedTags: ISecondaryTag[] = [];

  @Input()
  tags: ISecondaryTag[] = [];

  @Input()
  highlights: { [field: string]: string[] | undefined } = {};

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tags'] || changes['highlights']) {
      this.parsedTags = combineHighlightsWith(this.tags, this.highlights);
    }
  }

  identityTagTrack: TrackByFunction<ISecondaryTag> = (
    index: number,
    tag: ISecondaryTag
  ) => tag;

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }
}
