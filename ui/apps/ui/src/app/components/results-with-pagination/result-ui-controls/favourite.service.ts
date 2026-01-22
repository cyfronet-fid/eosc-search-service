import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFavouriteResourceInfo } from '@collections/repositories/types';
import { environment } from '@environment/environment';
import {COLLECTION} from "@collections/data/adapters/search-metadata.data";

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  constructor(private _http: HttpClient) { }

  getFavourites$(): Observable<IFavouriteResourceInfo[]>{
    return this._http.get<IFavouriteResourceInfo[]>(`/${environment.backendApiPath}/favourites`);
  }

  addToFavourites$(pid: string, resourceType: string): Observable<HttpResponse<IFavouriteResourceInfo>>{
    return this._http.post<IFavouriteResourceInfo>(`/${environment.backendApiPath}/favourites`, { pid, resourceType }, {observe: 'response'});
  }

  deleteFromFavourites$(pid: string, resourceType: string): Observable<HttpResponse<IFavouriteResourceInfo>>{
    return this._http.delete<IFavouriteResourceInfo>(`/${environment.backendApiPath}/favourites`, {
      params: { pid, resourceType },
      observe: 'response'
    });
  }
}
