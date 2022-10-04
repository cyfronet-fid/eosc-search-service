import { Component, OnInit } from '@angular/core';
import { IRecommendation } from '@components/recommendations/recommendations.types';
import { RedirectService } from '@collections/services/redirect.service';
import { RecommendationsService } from '@components/recommendations/recommendations.service';
import { switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { IResult } from '@collections/repositories/types';

@UntilDestroy()
@Component({
  selector: 'ess-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent implements OnInit {
  recommendations: IResult[] = [];

  constructor(
    private _route: CustomRoute,
    public redirectService: RedirectService,
    private _recommendationsService: RecommendationsService
  ) {}

  ngOnInit(): void {
    this._route.collection$
      .pipe(
        switchMap((panelId) =>
          this._recommendationsService.getRecommendations$(panelId)
        ),
        untilDestroyed(this)
      )
      .subscribe((recommendations) => (this.recommendations = recommendations));
  }
}
