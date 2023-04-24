import { Component, OnInit } from '@angular/core';
import { IResult } from '@collections/repositories/types';
import { GuidelinesService } from './guidelines.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guidelinesAdapter } from '@collections/data/guidelines/adapter.data';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import { NEVER, catchError, from, map, switchMap } from 'rxjs';
import { IGuideline } from '@collections/data/guidelines/guideline.model';

interface IIGDictionary {
  [key: string]: string;
}

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

  interoperabilityGuidelineStatusesDictionary: IIGDictionary = {
    'ir_status-abandoned': 'Abandoned',
    'ir_status-accepted': 'Accepted',
    'ir_status-candidate': 'Candidate',
    'ir_status-proposed': 'Proposed',
    'ir_status-consultation': 'Consultation',
    'ir_status-deprecated': 'Deprecated',
    'ir_status-on_hold': 'On Hold',
    'ir_status-operating': 'Operating',
    'ir_status-rejected': 'Rejected',
    'ir_status-withdrawn': 'Withdrawn',
  };

  interoperabilityGuidelineTypeDictionary: IIGDictionary = {
    'ir_eosc_guideline_type-eosc_core_interoperability_guideline':
      'EOSC-Core Interoperability Guideline',
    'ir_eosc_guideline_type-eosc_exchange_interoperability_guideline_horizontal':
      'EOSC-Exchange Interoperability Guideline (Horizontal)',
    'ir_eosc_guideline_type-eosc_exchange_interoperability_guideline_thematic':
      'EOSC-Exchange Interoperability Guideline (Thematic)',
    'ir_eosc_guideline_type-operational_baseline': 'Operational Baseline',
  };

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
              // this._router.navigate(['**']);
              // return of({});
              // this._router.navigate(['**']);
              // return of({});
              return from(this._router.navigate(['**'])).pipe(map(() => NEVER));
            })
          );
        }),
        untilDestroyed(this)
      )
      .subscribe((item) => {
        this.guideline = guidelinesAdapter.adapter(
          item as Partial<IGuideline> & { id: string }
        );
        this.interoperabilityGuidelineItem = { ...item } as IGuideline;
      });
  }

  transformDate(strDate: string | undefined): string {
    return moment(strDate).format('YYYY-MM-DD');
  }

  getStatus(status: string): string {
    return this.interoperabilityGuidelineStatusesDictionary[status];
  }

  getEoscGuidelineType(type: string): string {
    return this.interoperabilityGuidelineTypeDictionary[type];
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
