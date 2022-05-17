import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter, map, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ui-sub-nav',
  template: `
    <div id="sub-nav">
      <a
        class="nav-btn"
        *ngFor="let btnConfig of btns$ | async"
        [routerLink]="'/' + btnConfig?.routerLink"
        routerLinkActive="active"
        queryParamsHandling="merge"
        >{{ btnConfig?.label }}</a
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
export class SubNavComponent implements OnInit {
  btns$ = new BehaviorSubject<any[]>([]);

  constructor(private _router: Router) {}

  ngOnInit() {
    this.btns$.next(
      environment.search.sets.map(({ urlPath: routerLink, title: label }) => ({
        label,
        routerLink,
      }))
    );
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() =>
          environment.search.sets.map(
            ({ urlPath: routerLink, title: label }) => ({
              label,
              routerLink,
            })
          )
        )
      )
      .subscribe((results) => this.btns$.next(results));
  }
}
