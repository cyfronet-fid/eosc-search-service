import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { NavConfigsRepository } from '../repositories/nav-configs.repository';

@Injectable({
  providedIn: 'root',
})
export class NavConfigResolver implements Resolve<void> {
  constructor(private _navConfigsRepository: NavConfigsRepository) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<void> | Promise<void> | void {
    const collectionId = route.paramMap.get('collection');
    if (!collectionId) {
      return EMPTY;
    }

    this._navConfigsRepository.setActive({ id: collectionId });
  }
}
