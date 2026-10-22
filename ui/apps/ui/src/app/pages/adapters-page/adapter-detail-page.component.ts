import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdaptersService } from '@pages/adapters-page/adapters.service';
import { IResult } from '@collections/repositories/types';
import { map, switchMap } from 'rxjs';
import { adaptersAdapter } from '@collections/data/adapters/adapter.data';
import { DICTIONARY_TYPE_FOR_PIPE } from '../../dictionary/dictionaryType';
import { RedirectService } from '@collections/services/redirect.service';
import { HttpClient } from '@angular/common/http';
import { ALLOWED_EXTENSIONS, FALLBACK_LOGO } from './config';

interface CreatorDetails {
  name?: string;
  identifier?: string;
  affiliation?: string;
}

@UntilDestroy()
@Component({
  selector: 'ess-adapter-detail-page',
  templateUrl: './adapter-detail-page.component.html',
  styleUrls: ['./adapter-detail-page.component.scss'],
})
export class AdapterDetailPageComponent implements OnInit {
  adapter?: IResult;
  creatorDetails: CreatorDetails[] = [];
  currentUrl: string = this._router.url;
  validatedLogoUrl: string = FALLBACK_LOGO;

  type = DICTIONARY_TYPE_FOR_PIPE;

  constructor(
    private route: ActivatedRoute,
    private adaptersService: AdaptersService,
    private _router: Router,
    public redirectService: RedirectService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params: Params) => params['adapterId']),
        switchMap((param) => {
          return this.adaptersService.get$(param);
        }),
        untilDestroyed(this)
      )
      .subscribe((item) => {
        this.adapter = adaptersAdapter.adapter(item);
        this.creatorDetails = this.getCreatorDetails(this.adapter);
        this.validateLogoUrl(this.adapter?.logoUrl);
      });
  }

  redirectUrl(url: string | undefined): string | null {
    if (!url) {
      return null;
    }
    return this.redirectService.internalUrl(url, 'id', 'guideline', '');
  }

  private validateLogoUrl(logoUrl?: string): void {
    if (!logoUrl) {
      this.validatedLogoUrl = FALLBACK_LOGO;
      return;
    }

    if (!this.isValidUrl(logoUrl)) {
      this.validatedLogoUrl = FALLBACK_LOGO;
      return;
    }

    if (!this.hasValidImageExtension(logoUrl)) {
      this.validatedLogoUrl = FALLBACK_LOGO;
      return;
    }

    this.validatedLogoUrl = logoUrl;
  }

  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private hasValidImageExtension(url: string): boolean {
    const urlWithoutQuery = url.split('?')[0];
    return ALLOWED_EXTENSIONS.some((ext) =>
      urlWithoutQuery.toLowerCase().endsWith(ext)
    );
  }

  stripHtml(html: string | string[] | null | undefined): string {
    if (!html) return '';

    const str = Array.isArray(html) ? html.join(' ') : html;
    return str.replace(/<[^>]*>/g, ''); // remove all HTML tags
  }

  get hasAnyKeywords(): boolean {
    return (this.adapter?.secondaryTags?.[0].values.length ?? 0) > 0;
  }

  get keywordString(): string {
    const firstTag = this.adapter?.secondaryTags?.[0];
    return firstTag?.values?.[0]?.label ?? '';
  }

  get hasAnyCreators(): boolean {
    return this.creatorDetails.length > 0;
  }

  private getCreatorDetails(adapter: IResult): CreatorDetails[] {
    const identifiers = Array.isArray(adapter.creator_identifiers)
      ? adapter.creator_identifiers
      : [adapter.creator_identifiers];
    const creatorCount = Math.max(
      adapter.creator_names?.length ?? 0,
      identifiers.length,
      adapter.creator_affiliations?.length ?? 0
    );

    return Array.from({ length: creatorCount }, (_, index) => ({
      name: this.getOptionalValue(adapter.creator_names?.[index]),
      identifier: this.getOptionalValue(identifiers[index]),
      affiliation: this.getOptionalValue(adapter.creator_affiliations?.[index]),
    })).filter(
      ({ name, identifier, affiliation }) => name || identifier || affiliation
    );
  }

  private getOptionalValue(value: string | undefined): string | undefined {
    return value?.trim() || undefined;
  }

  get packageUrl(): string | undefined {
    const value = this.adapter?.package;

    return Array.isArray(value) ? value[0] : value;
  }
}
