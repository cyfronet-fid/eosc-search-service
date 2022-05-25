import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header
      backendUrl="/${environment.backendApiPath}"
    ></ess-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event as NavigationEnd)
      )
      .subscribe(() => window.scrollTo(0, 0));
  }
}
