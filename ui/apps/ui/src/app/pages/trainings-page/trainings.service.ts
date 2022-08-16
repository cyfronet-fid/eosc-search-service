import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';
import { ITraining } from '../../collections/data/trainings/training.model';

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  private endpointUrl: string;
  private _collection: string;
  constructor(private _http: HttpClient) {
    this._collection = 'trainings';
    this.endpointUrl = `/${environment.backendApiPath}/${this._collection}`;
  }
  get$(id: number | string): Observable<ITraining> {
    return this._http.get<ITraining>(`${this.endpointUrl}/${id}`);
  }
}
