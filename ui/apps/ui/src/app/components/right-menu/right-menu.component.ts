import { Component, OnInit } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { INavigationLink } from '@components/collections-navigation/type';
import { toNavigationLink } from '@components/collections-navigation/utils';

@Component({
  selector: 'ess-right-menu',
  template: `<div>
    <a
      [queryParams]="{ q: '*' }"
      [routerLink]="'/search/provider'"
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
      >Providers -></a
    >
  </div>`,
  styles: [
    `
      a {
        color: #3d4db6;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        text-decoration-line: underline;
      }
    `,
  ],
})
export class RightMenuComponent implements OnInit {
  public navigationLinks: INavigationLink[] = [];
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
