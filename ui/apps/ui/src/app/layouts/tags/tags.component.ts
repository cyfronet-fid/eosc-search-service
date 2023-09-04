import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import {
  ITag,
  IValueWithLabel,
  IValueWithLabelAndLink,
} from '@collections/repositories/types';
import { combineHighlightsWith } from './utils';
import { ViewportScroller } from '@angular/common';
import { translateDictionaryValue } from '../../dictionary/translateDictionaryValue';
import { DICTIONARY_TYPE_FOR_PIPE } from '../../dictionary/dictionaryType';

@Component({
  selector: 'ess-tags',
  template: ` <div id="tags">
    <ng-container
      *ngFor="let tag of parsedTags; let i = index; trackBy: trackByLabel"
    >
      <div class="tag-row" *ngIf="tag.values.length > 0">
        <div class="tag tag-title">{{ tag.label }}:</div>
        <div class="tag-content">
          <ng-container
            *ngFor="let singleValue of cleanDuplicatedTagLabel(tag.values)"
          >
            <span class="tag">
              <a
                *ngIf="!singleValue.externalLink"
                href="javascript:void(0)"
                (click)="setActiveFilter(tag.filter, singleValue.value)"
              >
                {{ addSubTitle(singleValue.subTitle) }}
                {{ singleValue.label | filterPipe: tag.filter }}</a
              >
              <a
                *ngIf="
                  singleValue.externalLink && !singleValue.externalLink.broken
                "
                [href]="singleValue.externalLink.link"
                >{{ addSubTitle(singleValue.subTitle) }}
                {{ singleValue.label }}</a
              >
              <span
                *ngIf="
                  singleValue.externalLink && singleValue.externalLink.broken
                "
                [innerHTML]="singleValue.label"
              ></span>
              &nbsp;
            </span>
          </ng-container>
        </div>
      </div>
    </ng-container>
  </div>`,
  styles: [
    `
      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 3px;
      }

      .tag:last-child a::after {
        content: '';
        width: 0px;
        height: 0px;
        border-radius: 0px;
        line-height: 1.2;
      }
    `,
  ],
})
export class TagsComponent implements OnChanges {
  parsedTags: ITag[] = [];

  @Input()
  tags: ITag[] = [];

  @Input()
  highlights: { [field: string]: string[] | undefined } = {};

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();
  trackByLabel: TrackByFunction<ITag> = (index: number, entity: ITag) =>
    entity.label;

  constructor(private viewPortScroller: ViewportScroller) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tags'] || changes['highlights']) {
      this.parsedTags = combineHighlightsWith(this.tags, this.highlights);
    }
  }

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
    this.viewPortScroller.scrollToPosition([0, 0]);
  }

  cleanDuplicatedTagLabel(
    array: IValueWithLabelAndLink[]
  ): IValueWithLabelAndLink[] {
    if (array[array.length - 1].value.indexOf('>') !== -1) {
      array.reverse();
    }
    const a = array.reduce(
      (accumulator: IValueWithLabel[], current: IValueWithLabel) => {
        if (
          !accumulator.find(
            (item) =>
              translateDictionaryValue(
                DICTIONARY_TYPE_FOR_PIPE.TYPE_SCIENTIFIC_DOMAINS,
                item.label
              ).toString() ===
              translateDictionaryValue(
                DICTIONARY_TYPE_FOR_PIPE.TYPE_SCIENTIFIC_DOMAINS,
                current.label
              ).toString()
          )
        ) {
          accumulator.push(current);
        }
        return accumulator;
      },
      []
    );
    return a;
  }

  // cleanComas(array: IValueWithLabelAndLink[]): IValueWithLabelAndLink[] {
  //   return array.map((val) => val.label.slice(-1) === ',');
  // }

  addSubTitle(subTitle?: string) {
    return subTitle ? `${subTitle}: ` : undefined;
  }
}
