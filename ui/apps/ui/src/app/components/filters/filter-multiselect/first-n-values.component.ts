import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterTreeNode } from '@components/filters/types';

@Component({
  selector: 'ess-first-n-values',
  template: ` <div class="filter__viewport">
      <ess-checkboxes-tree
        [data]="activeEntities"
        (checkboxesChange)="
          $event[1] === false ? toggleActive.emit($event) : null
        "
      ></ess-checkboxes-tree>
    </div>
    <div class="filter__viewport">
      <ess-checkboxes-tree
        [data]="_nonActiveEntities"
        (checkboxesChange)="
          $event[1] === true ? toggleActive.emit($event) : null
        "
      ></ess-checkboxes-tree>
    </div>`,
  styles: [
    `
      .filter__viewport {
        max-height: 290px;
        overflow: auto;
      }
    `,
  ],
})
export class FirstNValuesComponent {
  _nonActiveEntities: FilterTreeNode[] = [];

  @Input()
  activeEntities: FilterTreeNode[] = [];

  @Input()
  set nonActiveEntities(nonActiveEntities: FilterTreeNode[]) {
    const max = this.displayMax - this.activeEntities.length;
    this._nonActiveEntities = nonActiveEntities.slice(0, max < 0 ? 0 : max);
  }

  @Input()
  displayMax = 10;

  @Output()
  toggleActive = new EventEmitter<[FilterTreeNode, boolean]>();
}
