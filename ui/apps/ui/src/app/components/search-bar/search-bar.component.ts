import { Component } from '@angular/core';

@Component({
  selector: 'ess-search-bar',
  template: `
    <div class="search-bar">
      <div class="container--xxl">
        <div class="row">
          <div class="col-md-3 col-12 logo-wrapper">
            <a href="/">
              <img
                id="logo"
                src="assets/logo-eosc-white.png"
                i18n-alt
                alt="EOSC logo"
              />
            </a>
          </div>
          <div class="col-md-9 col-12 mt-4">
            <div class="col-xl-9 col-12 search-row">
              <ess-search-input></ess-search-input>
              <!--p class="user-announcement" i18n>
                We're currently working on improving search engine. We test the
                best solutions, which may also be associated with some problems.
                We are open to all suggestions, if you want to report any issues
                -
                <a href="https://eosc-portal.eu/contact-us" target="_blank"
                  >Contact us</a
                >
              </p-->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      p.user-announcement {
        text-align: center;
        font-size: 11px;
        color: white;
        margin-bottom: 20px;
        max-width: 700px;
        margin-right: auto;
        margin-left: auto;
      }

      p.user-announcement a {
        color: white;
        text-decoration: underline;
      }

      p.user-announcement a:hover {
        opacity: 0.9;
        text-decoration: underline;
      }
    `,
  ],
})
export class SearchBarComponent {}
