import { Component, OnInit } from '@angular/core';
import { IResult } from '@collections/repositories/types';
import { GuidelinesService } from './guidelines.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guidelinesAdapter } from '@collections/data/guidelines/adapter.data';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NEVER, catchError, from, map, switchMap } from 'rxjs';
import { IGuideline } from '@collections/data/guidelines/guideline.model';

@UntilDestroy()
@Component({
  selector: 'ess-guideline-detail-page',
  templateUrl: './guideline-detail-page.component.html',
  styleUrls: ['./guideline-detail-page.component.scss'],
})
export class GuidelineDetailPageComponent implements OnInit {
  guideline?: IResult;
  interoperabilityGuidelineItem?: IGuideline;
  currentTab = 'about';

  constructor(
    private guidelinesService: GuidelinesService,
    private route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => params['guidelineId']),
        switchMap((param) => {
          return this.guidelinesService.get$(param).pipe(
            catchError(() => {
              return from(this._router.navigate(['**'])).pipe(map(() => NEVER));
            })
          );
        }),
        untilDestroyed(this)
      )
      .subscribe((item) => {
        this.interoperabilityGuidelineItem = { ...item } as IGuideline;
        this.guideline = guidelinesAdapter.adapter(
          item as Partial<IGuideline> & { id: string }
        );
      });
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
