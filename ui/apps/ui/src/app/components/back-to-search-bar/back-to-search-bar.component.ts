import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ess-back-to-search-bar',
  template: `<div class="eosc-back-search-bar">
    <div class="container">
      <div class="col-md-3 col-12 eosc-back-link">
        <div class="chevron-left"></div>
        <a routerLink="/{{ pv }}" [queryParams]="{ q: this.q }" i18n
          >Go to Search</a
        >
      </div>
    </div>
  </div>`,
})
export class BackToSearchBarComponent implements OnInit {
  q: string | undefined;
  pv: string | undefined;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.q = params['q'];
      this.pv = params['pv'];
    });
  }
}
