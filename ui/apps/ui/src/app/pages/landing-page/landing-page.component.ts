import { Component } from '@angular/core';
import { allSet } from '@eosc-search-service/search';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/search/' + allSet.urlPath;
  fqBy = (filterName: string, value: string) => ({
    q: '*',
    fq: [`${filterName}:"${value}"`],
  });
}
