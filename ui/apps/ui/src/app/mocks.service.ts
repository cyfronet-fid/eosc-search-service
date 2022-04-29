/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

const backendUrlBase = `/${environment.backendApiPath}`;

@Injectable({
  providedIn: 'root',
})
export class MocksService {
  constructor(private _http: HttpClient) {}

  getLabels$() {
    return this._http.get(`${backendUrlBase}/labels`) as Observable<any[]>;
  }
  getCategories$() {
    return this._http.get(`${backendUrlBase}/categories`) as Observable<any[]>;
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
