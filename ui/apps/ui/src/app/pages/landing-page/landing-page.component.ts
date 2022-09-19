import { Component } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/search/' + DEFAULT_COLLECTION_ID;
  researchProductsPath = '/search/'; // TODO: set publications url
  trainingsPath = '/search/'; // TODO: set trainings url
  fqBy(filterName: string, value: string) {
    return {
      q: '*',
      fq: [`${filterName}:"${value}"`],
    };
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
