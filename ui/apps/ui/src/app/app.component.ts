import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { CategoriesRepository } from '@eosc-search-service/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from '@environment/environment';

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
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _categoriesRepository: CategoriesRepository
  ) {}

  ngOnInit() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event as NavigationEnd),

        // Set active category
        tap(async () => {
          const activeCategoryId =
            new URLSearchParams(this._router.url).get('activeCategoryId') ||
            undefined;
          if (
            activeCategoryId ===
            this._categoriesRepository._store$.value.activeId
          ) {
            return;
          }

          this._categoriesRepository.setActive(activeCategoryId);
        })
      )
      .subscribe(() => window.scrollTo(0, 0));
  }
}
