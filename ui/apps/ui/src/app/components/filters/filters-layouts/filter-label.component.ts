import { Component, Input } from '@angular/core';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ess-filter-label',
  template: `<span class="filter-title"
      ><b>{{ label }}</b></span
    >
    <span (click)="resetAllActiveEntities()" class="clear-button-wrapper">
      <a href="javascript:void(0)" class="clear-button">clear all</a>
    </span>`,
  styles: [
    `
      .filter-title {
        padding-bottom: 6px;
        display: inline-block;
      }
    `,
  ],
})
export class FilterLabelComponent {
  @Input()
  label!: string;

  @Input()
  filter!: string;

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  async resetAllActiveEntities() {
    await this._router.navigate([], {
      queryParams: {
        fq: this._customRoute.fq().filter((fq) => !fq.startsWith(this.filter)),
      },
      queryParamsHandling: 'merge',
    });
  }
}
