import { Component } from '@angular/core';
import { environment } from '@environment/environment';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header></ess-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  constructor() {
    console.log(`CURRENT BUILD VERSION: ${environment.version}`);
    console.log(`CURRENT HASH: ${environment.latestRevision}`);
  }
}
