import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { ITraining } from '@collections/data/trainings/training.model';
import { COLLECTION } from '@collections/data/trainings/search-metadata.data';

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;

  constructor(private _http: HttpClient) {}

  get$(id: number | string): Observable<ITraining> {
    return this._http.get<ITraining>(
      `${this.endpointUrl}/${encodeURIComponent(id)}`
    );
  }
}
