import { Component, Inject, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ISet, SEARCH_SET_LIST } from '@eosc-search-service/search';
import {map} from "rxjs";

export interface INavigationLink {
  label: string;
  routerLink: string;
}

@Component({
  selector: 'ess-sub-nav',
  template: `
    <div id="sub-nav">
      <a
        class="nav-btn"
        *ngFor="let btnConfig of navigationLinks"
        [routerLink]="btnConfig.routerLink"
        routerLinkActive="active"
        [queryParams]="{q: (query$ | async)}"
        >{{ btnConfig.label }}</a
      >
    </div>
  `,
  styles: [
    `

    `,
  ],
})
export class SubNavComponent {
  public navigationLinks: INavigationLink[] = [];
  public query$ = this._route.queryParams.pipe(map(params => params['q'] || '*'))

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    @Inject(SEARCH_SET_LIST) private _search_sets: ISet[]
  ) {
    this.navigationLinks = this._makeNavigationLinks();
  }

  private _makeNavigationLinks(): INavigationLink[] {
    return this._search_sets.map(
      ({ urlPath: routerLink, title: label }) => ({
        label,
        routerLink: `/search/${routerLink}`,
      })
    );
  }
}
