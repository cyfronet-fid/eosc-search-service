import { Component } from '@angular/core';

@Component({
  selector: 'ess-search-bar',
  template: `
    <div class="search-bar">
      <div class="row">
        <div class="col-md-3 col-12 logo-wrapper">
          <a href="/">
            <img
              id="logo"
              src="assets/eosc-logo-color.png"
              i18n-alt
              alt="EOSC logo"
            />
          </a>
        </div>
        <div class="col-md-9 col-12 search-row">
          <ess-search-input></ess-search-input>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      #logo {
        max-width: 200px;
        margin-top: 25px;
      }
    `,
  ],
})
export class SearchBarComponent {}
