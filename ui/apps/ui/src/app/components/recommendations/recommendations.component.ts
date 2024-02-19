import { Component, OnInit } from '@angular/core';
import { RedirectService } from '@collections/services/redirect.service';
import { RecommendationsService } from '@components/recommendations/recommendations.service';
import { of, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { IResult } from '@collections/repositories/types';
import { truncate } from 'lodash-es';
import { toArray } from '@collections/filters-serializers/utils';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { Router } from '@angular/router';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { TransformArrayDescriptionPipe } from '../../pipe/interoperability-guidelines-filter.pipe';
import {
  RECOMMENDATIONS_TOOLTIP_TEXT_LOGGED,
  RECOMMENDATIONS_TOOLTIP_TEXT_NOTLOGGED,
} from '@collections/data/config';
import { UserProfileService } from '../../auth/user-profile.service';
import { NO_RECOMMENDATIONS_COLLECTIONS } from '@collections/data/config';

@UntilDestroy()
@Component({
  selector: 'ess-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit {
  recommendations: IResult[] = [];
  highlightsreal: { [field: string]: string[] | undefined } = {};
  tooltipText: string = RECOMMENDATIONS_TOOLTIP_TEXT_LOGGED;
  tooltipTextN: string = RECOMMENDATIONS_TOOLTIP_TEXT_NOTLOGGED;
  isLogged: boolean;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    public redirectService: RedirectService,
    private _recommendationsService: RecommendationsService,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _userProfileService: UserProfileService
  ) {
    this.isLogged = false;
  }

  ngOnInit(): void {
    this._customRoute.collection$
      .pipe(
        untilDestroyed(this),
        switchMap((panelId) => {
          if (NO_RECOMMENDATIONS_COLLECTIONS.includes(panelId)) {
            return of([]);
          }
          return this._recommendationsService
            .getRecommendations$(panelId)
            .pipe(untilDestroyed(this));
        })
      )
      .subscribe(
        (recommendations) =>
          (this.recommendations = recommendations.map((recommended) => ({
            ...recommended,
            title: truncate(recommended.title, { length: 80 }),
            description: truncate(
              new TransformArrayDescriptionPipe().transform(
                recommended.description
              ),
              {
                length: 400,
              }
            ),
          })))
      );
    this._userProfileService
      .get$()
      .pipe(untilDestroyed(this))
      .subscribe(
        (profile) =>
          (this.isLogged =
            profile.aai_id === '' || profile === null || profile === undefined
              ? false
              : true)
      );
  }

  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: this._addFilter(filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  _addFilter(filter: string, value: string): string[] {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fqMap = this._customRoute.fqMap();
    if (toArray(fqMap[value]).includes(value)) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    return deserializeAll(
      {
        ...this._customRoute.fqMap(),
        [filter]: [...toArray(this._customRoute.fqMap()[filter]), value],
      },
      filtersConfigs
    );
  }
}
