/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-categories',
  template: `
    <section class="dashboard__filter">
      <h5>Categories</h5>
      <ng-container *ngFor="let category of categories">
        <p>
          {{ category.label }}
          <span class="text-secondary" style="float: right">
            {{ category.count }}
          </span>
        </p>
      </ng-container>
    </section>
  `,
})
export class CategoriesComponent {
  @Input()
  categories!: any[] | null;
}
