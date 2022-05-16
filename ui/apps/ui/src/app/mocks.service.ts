/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';

const backendUrlBase = `/${environment.backendApiPath}`;

@Injectable({
  providedIn: 'root',
})
export class MocksService {
  constructor(private _http: HttpClient) {}

  getCategories$() {
    return of([
      {
        id: 'test',
        label: 'Access physical & e-infrastructures',
        count: 15,
      },
      {
        id: 'test2',
        label: 'Aggregators & integrators',
        count: 10,
      },
      {
        id: 'test3',
        label: 'Other',
        count: 50,
      },
    ]);
  }
  getRecommendations$() {
    return this._http.get(`${backendUrlBase}/recommendations`) as Observable<
      any[]
    >;
  }
  getResources$() {
    return this._http.get(
      `${backendUrlBase}/recommended-resources`
    ) as Observable<any[]>;
  }
}
