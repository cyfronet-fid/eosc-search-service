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

@UntilDestroy()
@Component({
  selector: 'ess-adapter-detail-page',
  templateUrl: './adapter-detail-page.component.html',
  styleUrls: ['./adapter-detail-page.component.scss'],
})
export class AdapterDetailPageComponent implements OnInit {
  adapter?: IResult;
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
}
