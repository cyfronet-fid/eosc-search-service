import { Component } from '@angular/core';
import { DEFAULT_COLLECTION_ID } from '@collections/data';

@Component({
  selector: 'ess-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  allUrlPath = '/search/' + DEFAULT_COLLECTION_ID;
}
