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

    <ess-checkboxes-tree
      [data]="getNonActiveEntities()"
      (checkboxesChange)="$event[1] === true ? toggleActive.emit($event) : null"
    ></ess-checkboxes-tree>`,
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
  @Input()
  activeEntities: FilterTreeNode[] = [];

  @Input()
  nonActiveEntities: FilterTreeNode[] = [];

  @Input()
  displayMax = 10;

  @Output()
  toggleActive = new EventEmitter<[FilterTreeNode, boolean]>();

  getNonActiveEntities() {
    const max = this.displayMax - this.activeEntities.length;
    return this.nonActiveEntities.slice(0, max < 0 ? 0 : max);
  }
}
