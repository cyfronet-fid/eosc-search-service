import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { RecommendationStateProps } from '@components/recommendations/recommendations.types';
import { setEntities, withEntities } from '@ngneat/elf-entities';
import { IResult } from '@collections/repositories/types';

@Injectable({ providedIn: 'root' })
export class RecommendationsRepository {
  readonly _store$ = createStore(
    {
      name: 'recommendations',
    },
    withProps<RecommendationStateProps>({
      panelId: 'all_collection',
      status: 'pending',
    }),
    withEntities<IResult>()
  );

  // ASYNC
  readonly loading$ = this._store$.pipe(
    select(({ status }) => status === 'pending')
  );

  // MUTATORS
  setEntities(entities: IResult[]) {
    this._store$.update(setEntities(entities));
  }
}
