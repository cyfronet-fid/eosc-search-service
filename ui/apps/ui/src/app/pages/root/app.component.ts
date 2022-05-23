import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header
      backendUrl="/${environment.backendApiPath}"
    ></ess-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
