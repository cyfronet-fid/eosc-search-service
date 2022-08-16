import {Inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {EMPTY, Observable} from "rxjs";
import {ISet, SEARCH_SET_LIST} from "@eosc-search-service/search";

@Injectable({
  providedIn: 'root',
})
export class SetResolver implements Resolve<ISet> {
  constructor(private router: Router, @Inject(SEARCH_SET_LIST) private _sets: ISet[]) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ): Observable<ISet> | Promise<ISet> | ISet {
    const urlId = route.paramMap.get('set');
    return this._sets.find((set) => set.urlPath === urlId) ?? EMPTY
  }
}
