import { Component } from '@angular/core';

@Component({
  selector: 'ess-search-bar',
  template: `
    <div class="search-bar">
      <div class="container--xxl">
        <div class="row">
          <div class="col-md-4 col-12 logo-wrapper">
            <a href="/">
              <img
                id="logo"
                src="assets/logo-eosc-white.png"
                i18n-alt
                alt="EOSC logo"
              />
            </a>
          </div>
          <div class="col-md-8 col-12 search-row">
            <ess-search-input></ess-search-input>
          </div>
        </div>
      </div>
    </div>
  `,

})
export class SearchBarComponent {}
