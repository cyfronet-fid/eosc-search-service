import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { ITraining } from '@collections/data/trainings/training.model';
import { COLLECTION } from '@collections/data/trainings/search-metadata.data';
import { IInteroperabilityRecord } from '@collections/repositories/types';

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;

  constructor(private _http: HttpClient) {}
  get$(id: number | string): Observable<ITraining> {
    return this._http.get<ITraining>(`${this.endpointUrl}/${id}`);
  }

  getFromProviderById$(): Observable<IInteroperabilityRecord> {
    alert('block');
    console.log('xxx');
    const id = 'f25fdfd1-8404-4269-b82e-26f09d324fc4';
    const endpointUrl = `https://beta.providers.eosc-portal.eu/api/interoperabilityRecord/${id}`;
    return this._http.get<IInteroperabilityRecord>(endpointUrl);
  }
}
