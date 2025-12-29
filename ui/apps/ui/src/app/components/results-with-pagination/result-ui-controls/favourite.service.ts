import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFavouriteResourceInfo } from '@collections/repositories/types';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  constructor(private _http: HttpClient) { }

  getFavourites$(): Observable<IFavouriteResourceInfo[]>{
    return this._http.get<IFavouriteResourceInfo[]>('/favourites');
  }

  addToFavourites$(pid: string, resourceType: string): Observable<HttpResponse<IFavouriteResourceInfo>>{
    return this._http.post<IFavouriteResourceInfo>('/favourites', { pid, resourceType }, {observe: 'response'});
  }

  deleteFromFavourites$(pid: string, resourceType: string): Observable<HttpResponse<IFavouriteResourceInfo>>{
    return this._http.delete<IFavouriteResourceInfo>('/favourites', {
      params: { pid, resourceType },
      observe: 'response'
    });
  }
}
