import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { CustomRouter } from '@collections/services/custom.router';

@UntilDestroy()
@Component({
  selector: 'ess-page-header',
  template: `
    <div id="container" class="page-heading">
      <h3>{{ (activeNavConfig$ | async)?.title }}</h3>
      <span id="results-count" class="text-secondary" i18n
        >(around {{ resultsCount }} results)</span
      >
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
    </div>
  `,
})
export class PageHeaderComponent {
  @Input()
  resultsCount!: number;

  activeNavConfig$ = this._navConfigsRepository.activeEntity$;

  constructor(
    private _customRouter: CustomRouter,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  goToUrl = (url: string | undefined) => this._customRouter.navigateByUrl(url);
}
