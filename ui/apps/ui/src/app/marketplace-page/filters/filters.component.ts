import { Component, Input } from '@angular/core';
import { IFilterTreeParams } from './filter-tree-params.interface';

@Component({
  selector: 'ui-filters',
  template: `
    <section class="dashboard__filter">
      <h5>Filter by</h5>
      <ui-filter *ngFor="let filter of filters" [filter]="filter"> </ui-filter>
    </section>
  `,
})
export class FiltersComponent {
  @Input()
  filters!: IFilterTreeParams[] | null;
}
