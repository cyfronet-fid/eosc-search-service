import { Component, OnInit } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { INavigationLink } from './type';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { toNavigationLink } from './utils';

@Component({
  selector: 'ess-collections-navigation',
  template: `
    <div class="container--xxl navigation">
      <div id="sub-nav">
        <ng-container *ngFor="let link of navigationLinks">
          <a
            class="nav-btn {{ link.label }}"
            [routerLink]="link.routerLink"
            [routerLinkActiveOptions]="{
              queryParams: 'ignored',
              paths: 'exact',
              matrixParams: 'ignored',
              fragment: 'ignored'
            }"
            routerLinkActive="active"
            [queryParams]="{ q: (q$ | async) }"
            >{{ link.label }}</a
          ></ng-container
        >
      </div>
    </div>
  `,
})
export class CollectionsNavigationComponent implements OnInit {
  public navigationLinks: INavigationLink[] = [];
  public showCollections = false;
  public q$ = this._customRoute.q$;

  constructor(
    private _customRoute: CustomRoute,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  ngOnInit() {
    this.navigationLinks = this._navConfigsRepository
      .getAll()
      .map(toNavigationLink);
  }
}
