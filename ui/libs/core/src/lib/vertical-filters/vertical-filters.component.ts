import { Component, Input } from '@angular/core';
import { IFilterTreeParams } from './filter-tree-params.interface';

@Component({
  selector: 'core-vertical-filters',
  template: `
    <section class="dashboard__filter">
      <h5>Filter by</h5>
      <core-vertical-filter *ngFor="let filter of filters" [filter]="filter">
      </core-vertical-filter>
    </section>
  `,
})
export class VerticalFiltersComponent {
  @Input()
  filters!: IFilterTreeParams[] | null;
}
