import { Component } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';
import { ConfigService } from '../../services/config.service';
import { DEFAULT_SORT } from '@components/sort-by-functionality/sort-value.type';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  marketplaceUrl = this._config.get().marketplace_url;
  allUrlPath = '/search/' + DEFAULT_COLLECTION_ID;
  researchProductsPath = '/search/'; // TODO: set publications url
  trainingsPath = '/search/'; // TODO: set trainings url

  constructor(private _config: ConfigService) {}

  fqBy(filterName: string, value: string) {
    return {
      q: '*',
      sortUI: DEFAULT_SORT,
      fq: [`${filterName}:"${value}"`],
    };
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
