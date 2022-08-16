import { Component, OnInit } from '@angular/core';
import { CustomRouter } from '../../pages/search-page/custom.router';
import { INavigationLink } from './type';
import { NavConfigsRepository } from '../../collections/repositories/nav-configs.repository';
import { toNavigationLink } from './utils';

@Component({
  selector: 'ess-collections-navigation',
  template: `
    <div id="sub-nav">
      <a
        class="nav-btn"
        *ngFor="let link of navigationLinks"
        [routerLink]="link.routerLink"
        routerLinkActive="active"
        [queryParams]="{ q: (q$ | async) }"
        >{{ link.label }}</a
      >
    </div>
  `,
})
export class CollectionsNavigationComponent implements OnInit {
  public navigationLinks: INavigationLink[] = [];
  public q$ = this._customRouter.q$;

  constructor(
    private _customRouter: CustomRouter,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  ngOnInit() {
    this.navigationLinks = this._navConfigsRepository
      .getAll()
      .map(toNavigationLink);
  }
}
