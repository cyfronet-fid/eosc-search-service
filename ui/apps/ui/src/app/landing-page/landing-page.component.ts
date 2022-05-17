import { Component } from '@angular/core';
import { allSet } from '../sets/all.set';

@Component({
  selector: 'ui-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/' + allSet.urlPath;
  fqBy = (filterName: string, value: string) => ({
    q: '*',
    fq: [`${filterName}:"${value}"`],
  });
}
