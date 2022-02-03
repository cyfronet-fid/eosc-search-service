import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

const backendUrlBase = "http://localhost:8000/api/web"

@Injectable({
  providedIn: 'root'
})
export class MocksService {

  constructor(private _http: HttpClient) {}

  getSearchResults$() {
    return this._http.get<any[]>(`${backendUrlBase}/search-results`)
  }
  getLabels$() {
    return this._http.get<any[]>(`${backendUrlBase}/labels`)
  }
  getCategories$() {
    return this._http.get<any[]>(`${backendUrlBase}/categories`)
  }
  getFilters$() {
    return this._http.get<any[]>(`${backendUrlBase}/filters`)
  }
  getRecommendations$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommendations`)
  }
  getRecommendedResources$() {
    return this._http.get<any[]>(`${backendUrlBase}/recommended-resources`)
  }
}
