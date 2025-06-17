import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdaptersService } from '@pages/adapters-page/adapters.service';
import { IResult } from '@collections/repositories/types';
import { map, switchMap } from 'rxjs';
import { adaptersAdapter } from '@collections/data/adapters/adapter.data';
import { DICTIONARY_TYPE_FOR_PIPE } from '../../dictionary/dictionaryType';
import { RedirectService } from '@collections/services/redirect.service';

@UntilDestroy()
@Component({
  selector: 'ess-adapter-detail-page',
  templateUrl: './adapter-detail-page.component.html',
  styleUrls: ['./adapter-detail-page.component.scss'],
})
export class AdapterDetailPageComponent implements OnInit {
  adapter?: IResult;
  currentUrl: string = this._router.url;

  type = DICTIONARY_TYPE_FOR_PIPE;

  constructor(
    private route: ActivatedRoute,
    private adaptersService: AdaptersService,
    private _router: Router,
    public redirectService: RedirectService
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
      });
  }

  redirectUrl(url: string | undefined): string | null {
    if (!url) {
      return null;
    }
    return this.redirectService.internalUrl(url, 'id', 'guideline', '');
  }
}
