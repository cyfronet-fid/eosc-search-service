import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { ITag, IValueWithLabel } from '@collections/repositories/types';
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
        <span class="tag tag-title"
          ><strong>{{ tag.label }}: </strong></span
        >
        <ng-container
          *ngFor="let singleValue of cleanDuplicatedTagLabel(tag.values)"
        >
          <span class="tag"
            ><a
              href="javascript:void(0)"
              (click)="setActiveFilter(tag.filter, singleValue.value)"
              [innerHTML]="singleValue.label | filterPipe: tag.filter"
            ></a
            >&nbsp;&nbsp;</span
          >
        </ng-container>
      </div>
    </ng-container>
  </div>`,
  styles: [
    `
      ::ng-deep .highlighted {
        background-color: #e8e7ff !important;
        padding: 3px;
      }

      .tag a::after {
        content: ',';
        width: 0px;
        height: 0px;
        border-radius: 0px;
        line-height: 1.2;
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

  cleanDuplicatedTagLabel(array: IValueWithLabel[]): IValueWithLabel[] {
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
}
