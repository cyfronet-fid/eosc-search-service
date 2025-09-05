import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COLLECTION } from '@collections/data/adapters/search-metadata.data';
import { IResult } from '@collections/repositories/types';
import { environment } from '@environment/environment';

@Injectable({ providedIn: 'root' })
export class AdaptersService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;

  constructor(private _http: HttpClient) {}

  get$(id: number | string): Observable<IResult> {
    return this._http.get<IResult>(
      `${this.endpointUrl}/${encodeURIComponent(id)}`
    );
  }
}
