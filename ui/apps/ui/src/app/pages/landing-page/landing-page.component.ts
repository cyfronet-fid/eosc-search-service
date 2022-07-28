import { Component } from '@angular/core';
import { publicationsSet, trainingsSet } from '@eosc-search-service/search';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/search/' + publicationsSet.urlPath;
  researchProductsPath = '/search/' + publicationsSet.urlPath;
  trainingsPath = '/search/' + trainingsSet.urlPath;
  fqBy = (filterName: string, value: string) => ({
    q: '*',
    fq: [`${filterName}:"${value}"`],
  });
  scroll = (el: HTMLElement) => {
    el.scrollIntoView();
  };
}
