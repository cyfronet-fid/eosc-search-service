import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Observable, map } from 'rxjs';
import {
  ITraining,
  ITrainingResponse,
} from '@pages/trainings-page/repository/training.model';
import { allCollectionsAdapter } from '@collections/data/all/adapter.data';
import { COLLECTION } from '@collections/data/all/search-metadata.data';

export const trainingsAdapter = (training: ITrainingResponse): ITraining => ({
  ...allCollectionsAdapter.adapter(training),
  keywords: training.keywords,
  originUrl: training.URL_s,
});

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  endpointUrl = `/${environment.backendApiPath}/${COLLECTION}`;

  constructor(private _http: HttpClient) {}
  get$(id: number | string): Observable<ITraining> {
    return this._http.get<ITrainingResponse>(`${this.endpointUrl}/${id}`).pipe(
      map((training) => {
        const result = trainingsAdapter(training);
        result.tags = result.tags.filter((tag) => tag.values.length !== 0);
        return result;
      })
    );
  }
}
