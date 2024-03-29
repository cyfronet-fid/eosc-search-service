import { Injectable } from '@angular/core';
import { IRecommendationResponse } from '@components/recommendations/recommendations.types';
import { UserProfileService } from '../../auth/user-profile.service';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { allCollectionsAdapter } from '@collections/data/all/adapter.data';
import { IResult } from '@collections/repositories/types';
import { RecommendationsRepository } from '@components/recommendations/recommendations.repository';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  loading$ = this._recommendationsRepository.loading$;

  constructor(
    private _userProfileService: UserProfileService,
    private _recommendationsRepository: RecommendationsRepository,
    private _http: HttpClient
  ) {}

  getRecommendations$(panelId: string): Observable<IResult[]> {
    const url = `${environment.backendApiPath}/${environment.recommendationsApiPath}?panel_id=${panelId}`;
    return this._http.get<IRecommendationResponse>(url).pipe(
      catchError(() =>
        of({
          isRand: false,
          message: 'Upssss, something gone wrong with recommendations',
          recommendations: [],
        } as IRecommendationResponse)
      ),
      map(({ recommendations }) =>
        recommendations.map((recommendation) =>
          allCollectionsAdapter.adapter(recommendation)
        )
      ),
      tap((recommendations) =>
        this._recommendationsRepository.setEntities(recommendations)
      )
    );
  }
}
