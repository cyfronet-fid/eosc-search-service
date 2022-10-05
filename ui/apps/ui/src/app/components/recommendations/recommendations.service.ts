import { Injectable } from '@angular/core';
import { IRecommendation } from '@components/recommendations/recommendations.types';
import { UserProfileService } from '../../auth/user-profile.service';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
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
    return this._userProfileService.user$.pipe(
      switchMap((user) => {
        if (user.username === '') {
          return of([]) as Observable<IResult[]>;
        }

        const url = `${environment.backendApiPath}/${environment.recommendationsApiPath}?panel_id=${panelId}`;
        return this._http.get<IRecommendation[]>(url).pipe(
          catchError(() => of([])),
          map((recommendations) =>
            recommendations.map((recommendation) =>
              allCollectionsAdapter.adapter(recommendation)
            )
          ),
          tap((recommendations) =>
            this._recommendationsRepository.setEntities(recommendations)
          )
        );
      })
    );
  }
}
