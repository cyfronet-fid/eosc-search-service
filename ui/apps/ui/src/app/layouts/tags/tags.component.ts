import {
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { ITag } from '@collections/repositories/types';

@Component({
  selector: 'ess-tags',
  template: ` <div id="tags">
    <ng-container *ngFor="let tag of tags; trackBy: trackByLabel">
      <div class="tag-row" *ngIf="tag.values.length > 0">
        <span class="tag tag-title"
          ><strong>{{ tag.label }}: </strong></span
        >
        <ng-container *ngFor="let singleValue of tag.values">
          <span class="tag"
            ><a
              href="javascript:void(0)"
              (click)="setActiveFilter(tag.filter, singleValue.value)"
              >{{ singleValue.label }}</a
            >&nbsp;&nbsp;</span
          >
        </ng-container>
      </div>
    </ng-container>
  </div>`,
  styles: [],
})
export class TagsComponent {
  @Input()
  tags: ITag[] = [];

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();
  trackByLabel: TrackByFunction<ITag> = (index: number, entity: ITag) =>
    entity.label;

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }
}
