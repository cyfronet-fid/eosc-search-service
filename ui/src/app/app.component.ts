import { Component } from "@angular/core";
import { MocksService } from "./mocks.service";

@Component({
  selector: "app-root",
  template: `
    <app-main-header></app-main-header>
    <div class="container--xxl">
      <div class="search-bar">
        <div class="row">
          <div class="col-3 d-grid">
            <a href=".">
              <img id="logo" src="assets/eosc-logo-color.png" alt="EOSC logo" />
            </a>
          </div>
          <div class="col-6 d-grid vertical-center">
            <input type="text" id="search" class="rounded-pill" />
          </div>
          <div class="col-3 d-grid vertical-center">
            <button id="btn--search" class="btn btn-primary" type="button">
              Navigation
            </button>
          </div>
        </div>
      </div>
      <div class="dashboard">
        <div id="dashboard__header">
          <div id="header__search-phrase">
            <p class="text-secondary">SEARCH RESULTS FOR:</p>
            <h3>(display current search value)</h3>
          </div>
          <button type="button" id="dahboard__header-btn">
            Switch to recommended results only
          </button>
        </div>
        <div class="row gx-5" id="dashboard__labels">
          <ng-container *ngFor="let label of labels$ | async">
            <div class="col">
              <a
                [routerLink]="getLabelUrl(label.label)"
                class="dashboard__label"
                >{{ label.label }}&nbsp;<strong
                  >{{ label.count }} results</strong
                ></a
              >
            </div>
          </ng-container>
        </div>
        <br /><br /><br />
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {
  labels$ = this._mocksService.getLabels$();

  constructor(private _mocksService: MocksService) {}

  // TODO: Provide identifiers in backend for each label available
  getLabelUrl(label: string) {
    switch (label.toLowerCase()) {
      case "marketplace":
        return ["/marketplace"];
      case "research outcomes":
        return ["/articles"];
      default:
        return ["/"];
    }
  }
}
