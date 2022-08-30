import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HasDefaultQueryParamGuard implements CanActivate {
  constructor(private _router: Router, private _route: ActivatedRoute) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!route.queryParamMap.get('q')) {
      await this._router.navigate([state.url], {
        queryParams: { ...route.queryParams, q: '*' },
        relativeTo: this._route,
      });

      return false;
    }

    return true;
  }
}
