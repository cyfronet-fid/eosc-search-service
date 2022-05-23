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
      #sub-nav {
        width: 100%;
        margin-top: 15px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .active {
        color: rgba(57, 135, 190) !important;
        border-bottom: 4px solid rgba(57, 135, 190);
        font-weight: bold;
      }
      .nav-btn {
        color: rgba(0, 0, 0, 0.6000000238418579);
        margin-right: 20px;
        padding: 10px 0;
      }
      .nav-btn:hover {
        color: rgba(57, 135, 190) !important;
      }
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
