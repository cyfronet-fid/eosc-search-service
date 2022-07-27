import { ITraining } from '../../../../../search/src/lib/collections/trainings/training.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { CommonSettings, ESS_SETTINGS } from '@eosc-search-service/common';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private endpointUrl: string;
  private _collection: string;
  constructor(
    private _http: HttpClient,

    @Inject(ESS_SETTINGS) settings: CommonSettings
  ) {
    this._collection = 'trainings';
    this.endpointUrl = `/${settings.backendApiPath}/${this._collection}`;
  }
  get$(id: number | string): Observable<ITraining> {
    return this._http.get<ITraining>(`${this.endpointUrl}/${id}`);
  }
}
