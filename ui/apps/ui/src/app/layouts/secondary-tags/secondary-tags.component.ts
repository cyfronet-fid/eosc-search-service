import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import {
  ISecondaryTag,
  IValueWithLabel,
} from '@collections/repositories/types';
import { combineHighlightsWith } from './utils';

@Component({
  selector: 'ess-secondary-tags',
  template: `
    <div class="usage">
      <ng-container *ngFor="let tag of parsedTags; trackBy: identityTagTrack">
        <ng-container [ngSwitch]="tag.type">
          <ng-container *ngSwitchCase="'url'">
            <span *ngIf="tag.values.length > 0" class="statistic text-muted"
              ><img [src]="tag.iconPath" alt="" />&nbsp;
              <ng-container *ngFor="let keyword of arrayOfTags">
                <a
                  href="javascript:void(0)"
                  (click)="
                    tag.filter === 'more'
                      ? showMore()
                      : setActiveFilter($any(tag.filter), keyword.value)
                  "
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
      :host {
        display: block;
        margin-top: 48px;
      }

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
export class SecondaryTagsComponent implements OnChanges, OnInit {
  parsedTags: ISecondaryTag[] = [];

  @Input()
  tags: ISecondaryTag[] = [];

  @Input()
  highlights: { [field: string]: string[] | undefined } = {};

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  arrayOfTags: IValueWithLabel[] = [];
  show = false;
  temp: IValueWithLabel[] = [];

  ngOnInit() {
    let indexShowMore = 0;
    let more = false;

    console.log(this.tags[0]);

    const sum = this.tags[0].values.reduce(
      (previousValue, currentValue, index) => {
        if (previousValue > 268 && !more) {
          more = true;
          indexShowMore = index;
          this.arrayOfTags = [...this.tags[0].values.slice(0, index - 1)];
          this.arrayOfTags.push({
            label: `+${this.tags[0].values.length - (index - 1)} more`,
            value: `+${this.tags[0].values.length - (index - 1)} more`,
            subTitle: `total: ${this.tags[0].values.length}`,
          });

          this.tags[0].filter = 'more';
        }
        return previousValue + currentValue.label.length;
      },
      0
    );

    if (indexShowMore === 0) {
      this.arrayOfTags = [...this.tags[0].values];
    }
  }

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

  showMore(): void {
    if (this.show) {
      this.show = false;
      this.arrayOfTags = [...this.temp];
    } else {
      this.show = true;
      this.temp = [...this.arrayOfTags];
      this.arrayOfTags = [...this.tags[0].values];
      this.arrayOfTags.push({
        label: 'show less',
        value: 'show less',
        subTitle: `total: ${this.tags[0].values.length}`,
      });
    }
  }
}
