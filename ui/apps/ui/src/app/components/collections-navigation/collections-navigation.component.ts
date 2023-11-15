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
        <div id="bottom-border-wrapper">
          <a
            class="nav-btn {{ link.label }}"
            *ngFor="let link of navigationLinks"
            [routerLink]="link.routerLink"
            [routerLinkActiveOptions]="{
              queryParams: 'ignored',
              paths: 'exact',
              matrixParams: 'ignored',
              fragment: 'ignored'
            }"
            routerLinkActive="active"
            [queryParams]="{
              q: (q$ | async),
              standard: (st$ | async),
              tags: (tg$ | async),
              exact: (ex$ | async),
              radioValueAuthor: (radioValueAuthor$ | async),
              radioValueExact: (radioValueExact$ | async),
              radioValueTitle: (radioValueTitle$ | async),
              radioValueKeyword: (radioValueKeyword$ | async)
            }"
            >{{ link.label }}</a
          >
        </div>
      </div>
    </div>
  `,
})
export class CollectionsNavigationComponent implements OnInit {
  public navigationLinks: INavigationLink[] = [];
  public showCollections = false;
  public q$ = this._customRoute.q$;
  public st$ = this._customRoute.standard$;
  public tg$ = this._customRoute.tags$;
  public ex$ = this._customRoute.exact$;
  public radioValueAuthor$ = this._customRoute.radioValueAuthor$;
  public radioValueExact$ = this._customRoute.radioValueExact$;
  public radioValueTitle$ = this._customRoute.radioValueTitle$;
  public radioValueKeyword$ = this._customRoute.radioValueKeyword$;

  constructor(
    private _customRoute: CustomRoute,
    private _navConfigsRepository: NavConfigsRepository
  ) {}

  ngOnInit() {
    this.navigationLinks = this._navConfigsRepository
      .getAll()
      .filter((nav) => nav.id !== 'provider')
      .map(toNavigationLink);
  }
}
