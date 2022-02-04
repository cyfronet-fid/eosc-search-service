import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-main-header></app-main-header>
    <div class="container--xxl">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
