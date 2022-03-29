/* eslint-disable @typescript-eslint/no-explicit-any  */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FACETS } from './facet-param.interface';
import { ISearchResults } from './search-results.interface';
import { Observable, map, tap } from 'rxjs';
import { IFacetResponse } from './facet-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private _http: HttpClient) {}

  getResults$<T>(
    q: string,
    collection = environment.search.collection,
    facets = FACETS
  ): Observable<T[]> {
    const url = `${environment.backend.url}/${environment.backend.apiPath}/${environment.search.apiPath}`;
    const params = { params: { q, collection, qf: 'title' } };
    return this._http
      .post<ISearchResults<T>>(url, { facets }, params)
      .pipe(map((response) => response.results));
  }

  getFacetsCounts$(
    q: string,
    collection = environment.search.collection,
    facets = FACETS
  ): Observable<{ [facedName: string]: IFacetResponse }> {
    const url = `${environment.backend.url}/${environment.backend.apiPath}/${environment.search.apiPath}`;
    const params = { params: { q, collection, qf: 'title' } };
    return this._http
      .post<ISearchResults<any>>(url, { facets }, params)
      .pipe(map((response) => response.facets));
  }
}
