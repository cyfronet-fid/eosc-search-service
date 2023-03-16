import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'ess-page-header',
  template: `
    <div id="container" class="page-heading">
      <div>
        <span id="results-count" i18n>{{ resultsCount }} search results</span>
        {{ (activeNavConfig$ | async)?.title }}
      </div>
      <!---
      <div id="breadcrumbs">
        <nz-breadcrumb nzSeparator=">">
          <ng-container
            *ngFor="
              let breadcrumb of (activeNavConfig$ | async)?.breadcrumbs;
              last as $last
            "
          >
            <nz-breadcrumb-item *ngIf="!$last; else lastRef">
              <a (click)="goToUrl(breadcrumb.url)">
                {{ breadcrumb.label }}
              </a>
            </nz-breadcrumb-item>
            <ng-template #lastRef>
              <nz-breadcrumb-item>{{ breadcrumb.label }} </nz-breadcrumb-item>
            </ng-template>
          </ng-container>
        </nz-breadcrumb>
      </div>
    </div> --->
      <ess-sort-by-functionality></ess-sort-by-functionality>
    </div>
  `,
  styles: [
    `
      #container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input()
  resultsCount!: number;

  activeNavConfig$ = this._navConfigsRepository.activeEntity$;

  constructor(
    private _router: Router,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  async goToUrl(url: string | undefined) {
    await this._router.navigate([url], {
      queryParams: {
        fq: [],
        cursor: '*',
      },
      queryParamsHandling: 'merge',
    });
  }
}
