import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ess-back-to-search-bar',
  template: `<div class="eosc-back-search-bar">
    <div class="container">
      <div class="col-md-3 col-12 eosc-back-link">
        <div class="chevron-left"></div>
        <a routerLink="/search" i18n>Go to Search</a>
      </div>
    </div>
  </div>`,
})
export class BackToSearchBarComponent {}
