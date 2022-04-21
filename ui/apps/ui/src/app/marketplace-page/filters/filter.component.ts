import { Component, Input } from '@angular/core';
import { IFilterTreeParams } from './filter-tree-params.interface';

@Component({
  selector: 'ui-filter',
  template: `
    <h6 class="text-secondary">{{ filter?.label }}</h6>
    <input
      type="text"
      id="domains-filter"
      placeholder="Find or choose from the list"
    />
    <nz-tree
      [nzData]="filter?.buckets || []"
      nzCheckable
      nzMultiple
      [nzCheckedKeys]="[]"
      [nzExpandedKeys]="[]"
      [nzSelectedKeys]="[]"
    ></nz-tree>
  `,
})
export class FilterComponent {
  @Input()
  filter!: IFilterTreeParams | null;
}
