import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import { COLLECTION } from '@collections/data/guidelines/search-metadata.data';
import { IService } from '@collections/data/services/service.model';

@Injectable({ providedIn: 'root' })
export class GuidelinesService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;
  constructor(private _http: HttpClient) {}
  get$(id: number | string): Observable<IGuideline> {
    return this._http.get<IGuideline>(`${this.endpointUrl}/${id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFromProviderById$(id: number | string): Observable<any> {
    const endpoint = `/${environment.backendApiPath}/related_services?guideline_id=`;
    return this._http.get<IService[]>(`${endpoint}${id}`);
  }
}
