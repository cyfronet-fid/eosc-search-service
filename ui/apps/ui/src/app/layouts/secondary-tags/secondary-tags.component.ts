import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISecondaryTag } from '@collections/repositories/types';

@Component({
  selector: 'ess-secondary-tags',
  template: `
    <div class="usage">
      <ng-container *ngFor="let tag of tags">
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
        margin-right: 15px;
      }

      .statistic > img {
        margin-right: 2px;
      }
    `,
  ],
})
export class SecondaryTagsComponent {
  @Input()
  tags: ISecondaryTag[] = [];

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }
}
