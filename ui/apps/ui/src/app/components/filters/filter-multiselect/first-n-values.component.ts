import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { search } from '@components/filters/filter-multiselect/utils';
import {
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { flatNodesToTree } from '@components/filters/utils';

@Component({
  selector: 'ess-first-n-values',
  template: ` <div class="filter__viewport">
    <ess-checkboxes-tree
      [data]="_allEntities"
      (checkboxesChange)="toggleActive.emit($event)"
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
  _allEntities: IUIFilterTreeNode[] = [];

  @Input()
  query: string | null = null;

  @Input()
  allEntities: IFilterNode[] = [];

  @Input()
  displayMax = 10;

  @Output()
  toggleActive = new EventEmitter<[IUIFilterTreeNode, boolean][]>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['query'] || changes['allEntities'] || changes['displayMax']) {
      this._allEntities = flatNodesToTree(
        search(this.query, this.allEntities).sort((a, b) =>
          a.isSelected === b.isSelected ? 0 : a.isSelected ? -1 : 1
        )
      ).slice(0, this.displayMax);
    }
  }
}
