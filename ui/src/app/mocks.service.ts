import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

const backendUrlBase = `${environment.backendUrl}/${environment.webApiPath}`

@Injectable({
  providedIn: 'root'
})
export class MocksService {

  constructor(private _http: HttpClient) {}

  getUserInfo$() {
    return this._http.get<any>(`${backendUrlBase}/auth/userinfo`, { withCredentials: true})
  }
  getSearchResults$(q: string, collection: string, facets: object) {
    return this._http.post<any>(
      `${backendUrlBase}/search-results`,
      { facets },
      { params: { q, collection }, withCredentials: true }
    )
  }
  getLabels$() {
    return this._http.get<any[]>(`${backendUrlBase}/labels`, { withCredentials: true })
  }
  getCategories$() {
    return this._http.get<any[]>(`${backendUrlBase}/categories`, { withCredentials: true })
  }
  getRecommendations$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommendations`, { withCredentials: true })
  }
  getRecommendedResources$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommended-resources`, { withCredentials: true })
  }
}
