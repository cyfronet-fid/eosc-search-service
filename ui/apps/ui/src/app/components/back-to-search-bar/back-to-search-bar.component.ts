import { Component } from '@angular/core';

@Component({
  selector: 'ess-back-to-search-bar',
  template: `<div class="eosc-back-search-bar">
    <div class="container--xxl">
      <div class="col-md-3 col-12 eosc-back-link">
        <div class="chevron-left"></div>
        <a routerLink="/search" i18n>Go to Search</a>
      </div>
    </div>
  </div>`,
  styles: [
    `
      .eosc-back-search-bar {
        margin-top: -15px;
        height: 60px;
        text-decoration: none;
        font-weight: 100;
      }

      .eosc-back-link {
        padding-top: 17px;
      }
    `,
  ],
})
export class BackToSearchBarComponent {}
