import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { ITag } from '@collections/repositories/types';
import { combineHighlightsWith } from './utils';
import { ViewportScroller } from '@angular/common';

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
        <ng-container *ngFor="let singleValue of tag.values">
          <span class="tag"
            ><a
              href="javascript:void(0)"
              (click)="setActiveFilter(tag.filter, singleValue.value)"
              [innerHTML]="singleValue.label"
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
}
