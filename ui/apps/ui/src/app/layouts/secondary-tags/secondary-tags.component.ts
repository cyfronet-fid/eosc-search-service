import {
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { ISecondaryTag } from '@collections/repositories/types';

@Component({
  selector: 'ess-secondary-tags',
  template: `
    <div class="usage">
      <ng-container *ngFor="let tag of tags; trackBy: identityTagTrack">
        <ng-container [ngSwitch]="tag.type">
          <ng-container *ngSwitchCase="'url'">
            <span *ngIf="tag.values.length > 0" class="statistic text-muted"
              ><img [src]="tag.iconPath" alt="" />&nbsp;
              <a
                *ngFor="let keyword of tag.values"
                href="javascript:void(0)"
                (click)="setActiveFilter($any(tag.filter), keyword)"
                >{{ keyword }}&nbsp;&nbsp;&nbsp;</a
              ></span
            >
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
    `,
  ],
})
export class SecondaryTagsComponent {
  @Input()
  tags: ISecondaryTag[] = [];

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  identityTagTrack: TrackByFunction<ISecondaryTag> = (
    index: number,
    tag: ISecondaryTag
  ) => tag;

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }
}
