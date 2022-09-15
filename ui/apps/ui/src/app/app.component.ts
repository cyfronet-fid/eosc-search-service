import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header></ess-main-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
