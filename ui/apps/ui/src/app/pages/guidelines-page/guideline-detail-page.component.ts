import { Component, OnInit } from '@angular/core';
import { IResult } from '@collections/repositories/types';
import { GuidelinesService } from './guidelines.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guidelinesAdapter } from '@collections/data/guidelines/adapter.data';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NEVER, Observable, catchError, from, map, switchMap } from 'rxjs';
import {
  ICreators,
  IGuideline,
} from '@collections/data/guidelines/guideline.model';
import { DICTIONARY_TYPE_FOR_PIPE } from '../../dictionary/dictionaryType';
import { IService } from '@collections/data/services/service.model';
import { ConfigService } from '../../services/config.service';
import { FALLBACK_LOGO } from '@pages/adapters-page/config';
import { buildRelatedServicesLink } from '@collections/data/guidelines/related-services-link.utils';

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
  services$: Observable<IService[]> | undefined;
  relatedServicesLink?: string;

  type = DICTIONARY_TYPE_FOR_PIPE;

  marketplaceUrl: string = ConfigService.config?.marketplace_url;
  currentUrl: string = this._router.url;

  constructor(
    private guidelinesService: GuidelinesService,
    private route: ActivatedRoute,
    private _router: Router
  ) {}

  parseCreators(jsonDeserialized: string | undefined): Partial<ICreators>[] {
    return jsonDeserialized ? JSON.parse(jsonDeserialized) : [];
  }

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
        this.setRelatedServicesLink(
          (item as IGuideline).id,
          (item as IGuideline).title?.join(' ') ?? ''
        );
      });
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }

  getValue(value: string[] | undefined, index: number) {
    return value && value.length ? value[index] : '';
  }

  getIdentifierLink(): string | undefined {
    return this.interoperabilityGuidelineItem?.url?.[0];
  }

  private setRelatedServicesLink(id: string | number, title: string) {
    this.relatedServicesLink = undefined;
    this.guidelinesService
      .getRelatedResourceIds$(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (ids) => {
          this.relatedServicesLink = buildRelatedServicesLink(ids, title);
        },
        error: () => {
          this.relatedServicesLink = undefined;
        },
      });
  }

  hasRights(): boolean {
    return !!(
      this.interoperabilityGuidelineItem?.right_title?.some((x) => x?.trim()) ||
      this.interoperabilityGuidelineItem?.right_uri?.some((x) => x?.trim()) ||
      this.interoperabilityGuidelineItem?.right_id?.some((x) => x?.trim())
    );
  }

  hasRelatedStandards(): boolean {
    return !!(
      this.interoperabilityGuidelineItem?.related_standards_uri?.some((x) =>
        x?.trim()
      ) ||
      this.interoperabilityGuidelineItem?.related_standards_id?.some((x) =>
        x?.trim()
      )
    );
  }

  hasRightsSectionData(): boolean {
    return this.hasRights() || this.hasRelatedStandards();
  }

  protected readonly FALLBACK_LOGO = FALLBACK_LOGO;
}
