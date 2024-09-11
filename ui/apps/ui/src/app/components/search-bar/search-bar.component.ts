import { Component, ViewChild } from '@angular/core';
import { SearchInputComponent } from '@components/search-input/search-input.component';

@Component({
  selector: 'ess-search-bar',
  template: `
    <div class="search-bar">
      <div class="container--xxl">
        <div class="col-12">
          <ess-top-menu></ess-top-menu>
        </div>
        <div class="col-12 bordered-search">
          <div class="search-row">
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
export class SearchBarComponent {
  @ViewChild(SearchInputComponent) searchInputComponent!: SearchInputComponent;
  clearInput($event: unknown) {
    this.searchInputComponent.clearInput($event);
  }
}
