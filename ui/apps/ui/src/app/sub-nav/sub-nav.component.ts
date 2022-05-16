import { Component } from '@angular/core';

interface ISubNavBtn {
  label: string;
  routerLink: string;
  queryParamsHandling: 'merge';
}

@Component({
  selector: 'ui-sub-nav',
  template: `
    <div id="sub-nav">
      <a
        class="nav-btn"
        *ngFor="let btnConfig of btns"
        [routerLink]="btnConfig.routerLink"
        routerLinkActive="active"
        [queryParamsHandling]="btnConfig.queryParamsHandling"
        >{{ btnConfig.label }}</a
      >
    </div>
  `,
  styles: [
    `
      #sub-nav {
        width: 100%;
        margin-top: 15px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      .active {
        color: rgba(57, 135, 190) !important;
        border-bottom: 4px solid rgba(57, 135, 190);
        font-weight: bold;
      }
      .nav-btn {
        color: rgba(0, 0, 0, 0.6000000238418579);
        margin-right: 20px;
        padding: 10px 0;
      }
      .nav-btn:hover {
        color: rgba(57, 135, 190) !important;
      }
    `,
  ],
})
export class SubNavComponent {
  btns: ISubNavBtn[] = [
    {
      label: 'All catalogs',
      routerLink: 'all',
      queryParamsHandling: 'merge',
    },
    {
      label: 'Publications',
      routerLink: 'publications',
      queryParamsHandling: 'merge',
    },
    {
      label: 'Trainings',
      routerLink: 'trainings',
      queryParamsHandling: 'merge',
    },
    {
      label: 'Services',
      routerLink: 'services',
      queryParamsHandling: 'merge',
    },
  ];
}
