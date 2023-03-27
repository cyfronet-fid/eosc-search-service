import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'ess-interoperability-guidelines-details-page',
  templateUrl: './interoperability-guidelines-details-page.component.html',
  styleUrls: ['./interoperability-guidelines-details-page.component.scss'],
})
export class InteroperabilityGuidelinesDetailsPageComponent {
  constructor(private _config: ConfigService) {}

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
