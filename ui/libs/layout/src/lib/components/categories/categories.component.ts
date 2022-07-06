/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CategoriesRepository, ICategory} from "@eosc-search-service/common";


@Component({
  selector: 'ess-categories',
  template: `
    <section class="filters">
      <h5>Categories</h5>
      <ng-container *ngFor="let category of currentCategories">
        <div
          class="category"
          [class.selected]="activeId ===  category.id"
          (click)="goTo(category)"
        >
          <span>{{ category.label }}</span>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    .filters {
      padding: 0 15px 15px 15px;
    }
    .category {
      width: 100%;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 5px;
      font-size: 13px;
    }
    .category:hover > span:first-child {
      color: #0C2BD5 !important;
    }
    .category > span:first-child {
      display: inline-block;
      line-height: 15px;
    }
    .selected > span {
      font-weight: bold;
    }
  `]
})
export class CategoriesComponent {
  @Input()
  currentCategories: ICategory[] = [];

  @Input()
  activeId: string | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
  ) {}

  goTo = async (category: ICategory) => {
    await this._router.navigate([],
      {
        relativeTo: this._route,
        queryParams: { qf: category.filters, activeCategoryId: category.id },
        queryParamsHandling: 'merge'
      })
  }
}
