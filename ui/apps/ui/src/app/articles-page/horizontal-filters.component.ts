import { Component } from '@angular/core';

@Component({
  selector: 'ui-horizontal-filters',
  template: `
    <div class="row" id="filters--horizontal">
      <div class="col">
        <nz-select nzPlaceHolder="Access Mode">
          <nz-option nzValue="jack" nzLabel="OPEN ACCESS"></nz-option>
          <nz-option nzValue="lucy" nzLabel="OTHER"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Result type">
          <nz-option nzValue="jack" nzLabel="Published"></nz-option>
          <nz-option nzValue="lucy" nzLabel="Private"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col-3">
        <nz-range-picker></nz-range-picker>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Funder">
          <nz-option nzValue="jack" nzLabel="EU University"></nz-option>
          <nz-option nzValue="lucy" nzLabel="AGH"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Type">
          <nz-option nzValue="jack" nzLabel="OPEN ACCESS"></nz-option>
          <nz-option nzValue="lucy" nzLabel="OTHER"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Language">
          <nz-option nzValue="jack" nzLabel="ENG"></nz-option>
          <nz-option nzValue="lucy" nzLabel="DE"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Community">
          <nz-option nzValue="jack" nzLabel="EoscHub"></nz-option>
          <nz-option nzValue="lucy" nzLabel="OpenAir"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
      <div class="col">
        <nz-select nzPlaceHolder="Content Provider">
          <nz-option nzValue="jack" nzLabel="EoscHub"></nz-option>
          <nz-option nzValue="lucy" nzLabel="OpenAir"></nz-option>
          <nz-option nzValue="disabled" nzLabel="..."></nz-option>
        </nz-select>
      </div>
    </div>
  `,
})
export class HorizontalFiltersComponent {}
