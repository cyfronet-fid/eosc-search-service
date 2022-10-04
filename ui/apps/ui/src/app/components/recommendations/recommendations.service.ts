import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import {
  IRecommendation,
  RecommendationStateProps,
} from '@components/recommendations/recommendations.types';
import { setEntities, withEntities } from '@ngneat/elf-entities';
import { UserProfileService } from '../../auth/user-profile.service';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { allCollectionsAdapter } from '@collections/data/all/adapter.data';
import { IResult } from '@collections/repositories/types';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  readonly _store$ = createStore(
    {
      name: 'recommendations',
    },
    withProps<RecommendationStateProps>({ panelId: 'all', status: 'pending' }),
    withEntities<IResult>()
  );

  // ASYNC
  readonly loading$ = this._store$.pipe(
    select(({ status }) => status === 'pending')
  );

  constructor(
    private _userProfileService: UserProfileService,
    private _http: HttpClient
  ) {}

  getRecommendations$(panelId: string): Observable<IResult[]> {
    return this._userProfileService.user$.pipe(
      switchMap((user) => {
        if (user.username === '') {
          return of([]) as Observable<IResult[]>;
        }
        return this._http
          .get<IRecommendation[]>(
            `${environment.backendApiPath}/${environment.recommendationsApiPath}?panel_id=${panelId}`
          )
          .pipe(
            catchError(() => of([])),
            map((recommendations) =>
              recommendations.map((r) => allCollectionsAdapter.adapter(r))
            ),
            tap((recommendations) =>
              this._store$.update(setEntities(recommendations))
            )
          );
      })
    );
  }
}
