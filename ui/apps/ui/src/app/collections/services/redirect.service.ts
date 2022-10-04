import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { IResult } from '@collections/repositories/types';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private _router: Router, private _customRoute: CustomRoute) {}

  internalUrl(externalUrl: string, id: string, type: string) {
    const sourceUrl = this._router.url.includes('?')
      ? `${this._router.url}&url=${encodeURIComponent(externalUrl)}`
      : `${this._router.url}?url=${encodeURIComponent(externalUrl)}`;
    const sourceQueryParams = sourceUrl.split('?')[1];

    const destinationUrl = `${environment.backendApiPath}/${environment.navigationApiPath}`;
    const destinationQueryParams = `${sourceQueryParams}&collection=${this._customRoute.collection()}`;
    return `${destinationUrl}?${destinationQueryParams}&resource_id=${id}&resource_type=${type}&page_id=/search/${this._customRoute.collection()}`;
  }
}
