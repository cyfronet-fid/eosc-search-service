import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'ui-root',
  template: `
    <core-main-header
      backendUrl="/${environment.backendApiPath}"
    ></core-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
