import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

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
    const params = {
      q: "*",
      collection: "oag_researchoutcomes_prod_20211208_v2"
    }
    return this._http.get<any>(`${backendUrlBase}/search-results`, { params: params, withCredentials: true })
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
