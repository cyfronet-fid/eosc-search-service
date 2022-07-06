import {Component, Input} from '@angular/core';
import {IBreadcrumb, ISet,} from '@eosc-search-service/search';
import {BehaviorSubject, map} from "rxjs";
import {CategoriesRepository, ICategory} from "@eosc-search-service/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'ess-sub-header',
  template: `
    <div id="container" class="page-heading">
      <ng-container *ngIf="activeSet !== null">
        <h3>{{ activeSet.title }}</h3>
        <span id="results-count" class="text-secondary" i18n
          >(around {{ resultsCount }} results)</span
        >
        <div id="breadcrumbs">
          <nz-breadcrumb nzSeparator=">">
            <ng-container
              *ngFor="let breadcrumb of breadcrumbs$ | async; last as $last"
            >
              <nz-breadcrumb-item *ngIf="!$last; else lastRef">
                <a (click)="breadcrumb.filters ? goToCategory(breadcrumb) : goToUrl(breadcrumb.url)">
                  {{ breadcrumb.label }}
                </a>
              </nz-breadcrumb-item>
              <ng-template #lastRef>
                <nz-breadcrumb-item>{{ breadcrumb.label }} </nz-breadcrumb-item>
              </ng-template>
            </ng-container>
          </nz-breadcrumb>
        </div>
      </ng-container>
    </div>
  `,

})
export class SubHeaderComponent {
  @Input() activeSet: ISet | null = null;
  @Input() resultsCount: number | null = null;
  @Input()
  set categoriesTree(tree: ICategory[]) {
    const categoriesBreadcrumbs = tree.map((category) => ({ ...category, url: '' })) as IBreadcrumb[];
    this.breadcrumbs$.next([...(this.activeSet?.breadcrumbs || []), ...(categoriesBreadcrumbs)])
  }
  breadcrumbs$ = new BehaviorSubject<(IBreadcrumb & Partial<ICategory>)[]>([]);

  constructor(
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  async goToUrl(url: string | undefined): Promise<boolean> {
    return await this._router.navigate(
      [url as string],
      {
        relativeTo: this._route,
        queryParams: { activeCategoryId: null },
        queryParamsHandling: 'merge'
      }
    )
  }

  async goToCategory(category: IBreadcrumb & Partial<ICategory>): Promise<boolean> {
    return await this._router.navigate([],
      {
        relativeTo: this._route,
        queryParams: { qf: category.filters || [], activeCategoryId: category.id },
        queryParamsHandling: 'merge'
      })
  }
}
