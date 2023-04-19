import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private _router: Router, private _customRoute: CustomRoute) {}

  internalUrl(
    externalUrl: string | null,
    id: string,
    type: string,
    recommendation: boolean = false
  ): string | null {
    if (externalUrl === null) {
      return null;
    }

    const sourceUrl = this._router.url.includes('?')
      ? `${this._router.url}&url=${encodeURIComponent(externalUrl)}`
      : `${this._router.url}?url=${encodeURIComponent(externalUrl)}`;
    const sourceQueryParams =
      sourceUrl.split('?')[1] + `&pv=search/${this._customRoute.collection()}`;

    const destinationUrl = `${environment.backendApiPath}/${environment.navigationApiPath}`;
    const destinationQueryParams = `${sourceQueryParams}&collection=${this._customRoute.collection()}`;
    return `${destinationUrl}?${destinationQueryParams}&resource_id=${id}&resource_type=${type}&page_id=/search/${this._customRoute.collection()}&recommendation=${recommendation}`;
  }
}
