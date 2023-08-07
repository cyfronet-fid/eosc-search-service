import { Component } from '@angular/core';

@Component({
  selector: 'ess-right-menu',
  template: `<div>
    <a [queryParams]="{ q: '*' }" [routerLink]="'/search/provider'"
      >Providers -></a
    >
  </div>`,
  styles: [
    `
      a {
        color: #3d4db6;
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        text-decoration-line: underline;
      }
    `,
  ],
})
export class RightMenuComponent {}
