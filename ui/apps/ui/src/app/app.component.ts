import { Component } from '@angular/core';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header></ess-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
