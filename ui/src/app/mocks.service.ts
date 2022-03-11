import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

const backendUrlBase = `${environment.backendUrl}/${environment.webApiPath}`;

@Injectable({
  providedIn: "root",
})
export class MocksService {
  constructor(private _http: HttpClient) {}

  getUserInfo$() {
    return this._http.get<{ username: string }>(
      `${backendUrlBase}/auth/userinfo`
    );
  }
  getSearchResults$(q: string, collection: string, facets: object) {
    return this._http.post<object[]>(
      `${backendUrlBase}/search-results`,
      { facets },
      { params: { q, collection }, withCredentials: true }
    );
  }
  getLabels$() {
    return this._http.get<object[]>(`${backendUrlBase}/labels`);
  }
  getCategories$() {
    return this._http.get<object[]>(`${backendUrlBase}/categories`);
  }
  getRecommendations$() {
    return this._http.get<object[]>(`${backendUrlBase}/recommendations`);
  }
  getRecommendedResources$() {
    return this._http.get<object[]>(`${backendUrlBase}/recommended-resources`);
  }
}
