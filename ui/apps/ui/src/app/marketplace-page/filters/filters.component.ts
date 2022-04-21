/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';
import { IFilterTreeParams } from './filter-tree-params.interface';

@Component({
  selector: 'ui-filters',
  template: `
    <section class="dashboard__filter">
      <h5>Filter by</h5>
      <ng-container *ngFor="let filter of filters">
        <h6 class="text-secondary">{{ filter.label }}</h6>
        <input
          type="text"
          id="domains-filter"
          placeholder="Find or choose from the list"
        />
        <nz-tree
          [nzData]="filter.buckets"
          nzCheckable
          nzMultiple
          [nzCheckedKeys]="[]"
          [nzExpandedKeys]="[]"
          [nzSelectedKeys]="[]"
        ></nz-tree>
      </ng-container>
    </section>
  `,
})
export class FiltersComponent {
  @Input()
  filters!: IFilterTreeParams[] | null;
}
