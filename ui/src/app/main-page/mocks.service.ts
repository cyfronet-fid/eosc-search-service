import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../eosc-profile-service/ui/src/environments/environment";

const backendUrlBase = `${environment.backendUrl}/${environment.webApiPath}`

@Injectable({
  providedIn: 'root'
})
export class MocksService {

  constructor(private _http: HttpClient) {}

  getUserInfo$() {
    return this._http.get<any>(`${backendUrlBase}/auth/userinfo`, { withCredentials: true})
  }
  getSearchResults$() {
    return this._http.get<any[]>(`${backendUrlBase}/search-results`, { withCredentials: true })
  }
  getLabels$() {
    return this._http.get<any[]>(`${backendUrlBase}/labels`, { withCredentials: true })
  }
  getCategories$() {
    return this._http.get<any[]>(`${backendUrlBase}/categories`, { withCredentials: true })
  }
  getFilters$() {
    return this._http.get<any[]>(`${backendUrlBase}/filters`, { withCredentials: true })
  }
  getRecommendations$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommendations`, { withCredentials: true })
  }
  getRecommendedResources$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommended-resources`, { withCredentials: true })
  }
}
