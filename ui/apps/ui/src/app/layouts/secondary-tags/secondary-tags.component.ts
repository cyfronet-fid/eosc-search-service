import {
  Component,
  EventEmitter,
  Input,
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
    <div class="usage secondary-tags">
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
export class SecondaryTagsComponent {
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

    const sum = this.getTagsValues().reduce(
      (previousValue, currentValue, index) => {
        if (previousValue > 268 && !more) {
          more = true;
          indexShowMore = index;
          this.arrayOfTags = [...this.getTagsValues().slice(0, index - 1)];
          this.arrayOfTags.push({
            label: `+${this.getTagsValues().length - (index - 1)} more`,
            value: `+${this.getTagsValues().length - (index - 1)} more`,
            subTitle: `total: ${this.getTagsValues().length}`,
          });

          this.getTag().filter = 'more';
        }
        return previousValue + currentValue.label.length;
      },
      0
    );

    if (indexShowMore === 0) {
      this.arrayOfTags = [...this.getTagsValues()];
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

  getTag(): ISecondaryTag {
    const checkValues: boolean = this.tags[0].values.length ? true : false;

    if (checkValues) {
      return this.tags[0];
    }

    return this.tags[1];
  }

  getTagsValues(): IValueWithLabel[] {
    if (this.tags[0].values) {
      return this.tags[0].values.length ? this.tags[0].values : [];
    }

    if (this.tags[1].values) {
      return this.tags[1].values.length ? this.tags[1].values : [];
    }

    return [];
  }

  showMore(): void {
    if (this.show) {
      this.show = false;
      this.arrayOfTags = [...this.temp];
    } else {
      this.show = true;
      this.temp = [...this.arrayOfTags];
      this.arrayOfTags = [...this.getTagsValues()];
      this.arrayOfTags.push({
        label: 'show less',
        value: 'show less',
        subTitle: `total: ${this.getTagsValues().length}`,
      });
    }
  }
}
