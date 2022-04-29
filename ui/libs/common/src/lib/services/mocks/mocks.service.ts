/* eslint-disable @typescript-eslint/no-explicit-any  */

import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CommonSettings, ICategory} from "../../types";
import {ESS_SETTINGS} from "../../common.providers";


@Injectable({
  providedIn: 'root',
})
export class MocksService {
  constructor(private _http: HttpClient, @Inject(ESS_SETTINGS) private CONSTANTS: CommonSettings) {
  }

  getLabels$() {
    return this._http.get(`${this.CONSTANTS.backendApiPath}/labels`) as Observable<any[]>;
  }
  getCategories$() {
    return this._http.get<ICategory[]>(`${this.CONSTANTS.backendApiPath}/categories`);
  }
  getRecommendations$() {
    return this._http.get(`${this.CONSTANTS.backendApiPath}/recommendations`) as Observable<
      any[]
    >;
  }
  getResources$() {
    return this._http.get(
      `${this.CONSTANTS.backendApiPath}/recommended-resources`
    ) as Observable<any[]>;
  }
}
