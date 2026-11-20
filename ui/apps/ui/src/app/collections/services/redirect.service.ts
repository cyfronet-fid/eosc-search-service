import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { ConfigService } from '../../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(
    private _router: Router,
    private _customRoute: CustomRoute,
    private _configService: ConfigService
  ) {}

  internalUrl(
    externalUrl: string | null,
    id: string,
    type: string,
    offerId: string,
    recommendation: boolean = false,
    eventName: string = ''
  ): string | null {
    if (externalUrl === null) {
      return null;
    }

    const encodedPv = encodeURIComponent(
      'search/' + this._customRoute.collection()
    );

    const originalQueryParams = this._router.url.includes('?')
      ? encodeURIComponent(this._router.url.split('?')[1])
      : '';

    const destinationUrl = `${environment.backendApiPath}/${environment.navigationApiPath}`;

    const queryParams: Record<string, string> = {
      url: encodeURIComponent(externalUrl),
      collection: this._customRoute.collection() ?? '',
      resource_id: id,
      resource_type: type,
      page_id: encodedPv,
      recommendation: recommendation ? 'true' : 'false',
      return_path: encodedPv,
      search_params: originalQueryParams,
    };
    // Only read in the browser, to name the Matomo click-through event.
    // The backend ignores it.
    if (eventName !== '') {
      queryParams['event_name'] = eventName;
    }

    const encodedQueryParams = new URLSearchParams(queryParams);
    return offerId === ''
      ? destinationUrl + '?' + encodedQueryParams.toString()
      : destinationUrl + '?' + encodedQueryParams.toString() + offerId;
  }
}
