import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FilterTreeNode } from '@components/filters/types';
import { search } from '@components/filters/filter-multiselect/utils';

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
export class FirstNValuesComponent implements OnChanges {
  _nonActiveEntities: FilterTreeNode[] = [];

  @Input()
  query: string | null = null;

  @Input()
  activeEntities: FilterTreeNode[] = [];

  @Input()
  nonActiveEntities: FilterTreeNode[] = [];

  @Input()
  displayMax = 10;

  @Output()
  toggleActive = new EventEmitter<[FilterTreeNode, boolean]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'] || changes['nonActiveEntities']) {
      const max = this.displayMax - this.activeEntities.length;
      this._nonActiveEntities = search(
        this.query,
        this.nonActiveEntities
      ).slice(0, max < 0 ? 0 : max);
    }
  }
}
