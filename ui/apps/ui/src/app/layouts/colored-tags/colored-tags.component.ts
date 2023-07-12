import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IColoredTag, IValueWithLabel } from '@collections/repositories/types';

@Component({
  selector: 'ess-colored-tags',
  template: `<div class="tags-box">
    <a
      [routerLink]="'/search/' + type.value.replace(' ', '-')"
      [queryParams]="{ q: q }"
    >
      {{ type.label | filterPipe: type.value }}
    </a>

    <ng-container *ngFor="let tag of tags">
      <a
        *ngFor="let value of tag.values"
        [attr.class]="tag.colorClassName"
        href="javascript:void(0)"
        (click)="setActiveFilter(tag.filter, value.value)"
      >
        {{ value.label | filterPipe: tag.filter }}
      </a>
    </ng-container>
  </div>`,
  styles: [
    `
      .tags-box a.tag-beta {
        color: #5100fb;
        background-color: #effff1;
      }
    `,
  ],
})
export class ColoredTagsComponent {
  @Input()
  type!: IValueWithLabel;

  @Input()
  q!: string | null;

  @Input()
  tags: IColoredTag[] = [];

  @Output()
  activeFilter = new EventEmitter<{ filter: string; value: string }>();

  setActiveFilter(filter: string, value: string): void {
    this.activeFilter.emit({ filter, value });
  }
}
