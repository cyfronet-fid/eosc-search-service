/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';
import {ICategory} from "./category.intereface";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'core-categories',
  template: `
    <section id="categories">
      <h5>Categories</h5>
      <ng-container *ngFor="let category of categories">
        <div class="category" (click)="queryParams = { categoryId: category.id }">
          <span>{{ category.label }}</span>
          <span class="text-secondary" style="float: right">
            ({{ category.count }})
          </span>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    #categories {
      padding: 15px;
      margin-left: -15px;
      background-color: rgba(57, 135, 190, 0.05);
    }
    .category {
      width: 100%;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 5px;
    }
    .category:hover > span:first-child {
      color: rgba(57, 135, 190) !important;
    }
    .category > span:first-child {
      display: inline-block;
      max-width: calc(100% - 40px);
      line-height: 15px;
    }
    .category > span:nth-child(2) {
      float: right;
    }
  `]
})
export class CategoriesComponent {
  @Input()
  categories!: ICategory[] | null;

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  set queryParams(queryParams: { [param: string]: any }) {
    this._router.navigate([],
      {
        relativeTo: this._route,
        queryParams,
        queryParamsHandling: 'merge'
      })
  }
}
