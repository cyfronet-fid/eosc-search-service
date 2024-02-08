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
      <!-- Create some space between description and secondary tags -->
      <div *ngIf="checkTagsWithValues()" style="margin-bottom: 0.7rem;"></div>
      <ng-container *ngFor="let tag of parsedTags; trackBy: identityTagTrack">
        <ng-container [ngSwitch]="tag.type">
          <ng-container *ngSwitchCase="'url'">
            <span *ngIf="tag.values.length > 0" class="statistic text-muted">
              <ng-container *ngIf="tag.iconPath">
                <img [src]="tag.iconPath" alt="" />
              </ng-container>
              <ng-container *ngIf="tag.label">
                <span class="label-text">{{ tag.label }}</span>
              </ng-container>
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
            <span *ngIf="tag.values.length > 0" class="statistic text-muted">
              <ng-container *ngIf="tag.iconPath">
                <img [src]="tag.iconPath" alt="" />
              </ng-container>
              <ng-container *ngIf="tag.label">
                <span class="label-text">{{ tag.label }}</span>
              </ng-container>
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

      .label-text {
        color: black;
        display: inline;
        float: left;
        margin-right: 10px;
      }

      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 0px;
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

  checkTagsWithValues(): boolean {
    return (
      this.parsedTags && this.parsedTags.some((tag) => tag.values.length > 0)
    );
  }
}
